// @ts-nocheck
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

// Initialize Supabase client
const supabase = createClient(
  'https://iimlwwmxbaeinfcpqsxp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbWx3d214YmFlaW5mY3Bxc3hwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg1MzIyMSwiZXhwIjoyMDg0NDI5MjIxfQ.XpPo_lsDlcVJ3hr1Nfhcu62VTH9W9xPSE_nO_hFTV7M'
);

// Initialize Plaid client
const plaidConfig = new Configuration({
  basePath: PlaidEnvironments.production,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAIvvD_CLIENT_ID!,
      'PLAID-SECRET': process.env.PLAID_SECRET!,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const plaidClient = new PlaidApi(plaidConfig);

interface SyncResult {
  success: boolean;
  count?: number;
  error?: string;
  message?: string;
  inserted?: number;
  updated?: number;
  [key: string]: any;
}

interface ItemSyncResult {
  plaidItemId: string;
  userId: string;
  institutionName: string | null;
  success: boolean;
  results?: {
    accounts: SyncResult;
    transactions: SyncResult;
    recurringTransactions: SyncResult;
  };
  error?: string;
}

// ============================================
// LOGGING UTILITIES
// ============================================

function logSection(title: string) {
  console.log('\n' + '='.repeat(80));
  console.log(`  ${title}`);
  console.log('='.repeat(80));
}

// ============================================
// MAIN API HANDLER
// ============================================

export async function POST(request: Request) {
  const startTime = Date.now();
  
  logSection('🚀 PLAID SYNC STARTED');
  console.log(`Start Time: ${new Date().toISOString()}`);

  try {
    // Fetch all Plaid items
    const { data: plaidItems, error: fetchError } = await supabase
      .from('plaid_items')
      .select('*');

    if (fetchError) {
      console.error('❌ Error fetching plaid_items:', fetchError);
      throw fetchError;
    }

    console.log(`\n📊 Found ${plaidItems?.length || 0} Plaid items to sync`);

    if (!plaidItems || plaidItems.length === 0) {
      console.log('⚠️  No Plaid items found to sync');
      return NextResponse.json({
        success: true,
        message: 'No Plaid items to sync',
        totalItems: 0,
        itemsSucceeded: 0,
        itemsFailed: 0,
        duration: Date.now() - startTime,
      });
    }

    // Sync all items
    const itemResults: ItemSyncResult[] = [];

    for (const item of plaidItems) {
      logSection(`🔄 Syncing Item: ${item.id}`);
      console.log(`User ID: ${item.user_id}`);
      console.log(`Institution: ${item.institution_name || 'Unknown'}`);
      console.log(`Item ID: ${item.id}`);
      
      try {
        const [accounts, transactions, recurringTransactions] = await Promise.all([
          syncPlaidAccounts(item),
          syncPlaidTransactions(item),
          syncPlaidRecurringTransactions(item),
        ]);

        const results = {
          accounts,
          transactions,
          recurringTransactions,
        };

        // Update last_synced_at
        await supabase
          .from('plaid_items')
          .update({ last_synced_at: new Date().toISOString() })
          .eq('id', item.id);

        console.log(`\n✅ Successfully synced item ${item.id}`);
        console.log(`   Accounts: ${results.accounts.count || 0}`);
        console.log(`   Transactions: ${results.transactions.count || 0}`);
        console.log(`   Recurring Transactions: ${results.recurringTransactions.count || 0}`);

        itemResults.push({
          plaidItemId: item.id,
          userId: item.user_id,
          institutionName: item.institution_name,
          success: true,
          results,
        });

      } catch (error: any) {
        console.error(`\n❌ Failed to sync item ${item.id}:`, error.message);
        
        itemResults.push({
          plaidItemId: item.id,
          userId: item.user_id,
          institutionName: item.institution_name,
          success: false,
          error: error.message,
        });
      }
    }

    const successCount = itemResults.filter(r => r.success).length;
    const failureCount = itemResults.filter(r => !r.success).length;
    const duration = Date.now() - startTime;

    logSection('✨ SYNC COMPLETE');
    console.log(`Duration: ${duration}ms (${(duration / 1000).toFixed(2)}s)`);
    console.log(`✅ Succeeded: ${successCount}`);
    console.log(`❌ Failed: ${failureCount}`);
    console.log(`End Time: ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: 'Plaid sync completed',
      totalItems: plaidItems.length,
      itemsSucceeded: successCount,
      itemsFailed: failureCount,
      duration,
      itemResults,
    });

  } catch (error: any) {
    console.error('\n❌ FATAL ERROR:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to sync data', 
        details: error.message,
        duration: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

// ============================================
// SYNC FUNCTIONS
// ============================================

/**
 * Sync Plaid accounts to plaid_accounts table
 */
async function syncPlaidAccounts(item: any): Promise<SyncResult> {
  console.log('\n💰 SYNCING ACCOUNTS');
  
  try {
    // Fetch accounts from Plaid
    console.log('📡 Calling Plaid accountsGet API...');
    const response = await plaidClient.accountsGet({
      access_token: item.access_token,
    });

    console.log('✅ Plaid API response received');
    const accounts = response.data.accounts;
    console.log(`📊 Received ${accounts.length} accounts`);

    // Check existing accounts
    const plaidAccountIds = accounts.map(acc => acc.account_id);
    const { data: existingAccounts } = await supabase
      .from('plaid_accounts')
      .select('account_id')
      .in('account_id', plaidAccountIds)
      .eq('plaid_item_id', item.id);

    const existingAccountIds = new Set(
      existingAccounts?.map(acc => acc.account_id) || []
    );

    // Prepare data for upsert
    const accountsToUpsert = accounts.map(account => ({
      plaid_item_id: item.id,
      user_id: item.user_id,
      account_id: account.account_id,
      balances: account.balances,
      holder_category: account.holder_category || null,
      mask: account.mask || null,
      name: account.name,
      official_name: account.official_name || null,
      persistent_account_id: account.persistent_account_id || null,
      subtype: account.subtype,
      type: account.type,
      updated_at: new Date().toISOString(),
    }));

    // Perform upsert
    const { error: upsertError } = await supabase
      .from('plaid_accounts')
      .upsert(accountsToUpsert, {
        onConflict: 'account_id',
        ignoreDuplicates: false,
      });

    if (upsertError) {
      console.error('❌ Upsert error:', upsertError);
      throw upsertError;
    }

    const result = {
      success: true,
      count: accounts.length,
      inserted: accounts.length - existingAccountIds.size,
      updated: existingAccountIds.size,
    };

    console.log('✅ Account sync complete:', result);
    return result;

  } catch (error: any) {
    console.error('\n❌ Error syncing accounts:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sync Plaid transactions to plaid_transactions table
 */
async function syncPlaidTransactions(item: any): Promise<SyncResult> {
  console.log('\n💳 SYNCING TRANSACTIONS');
  
  try {
    // Calculate date range (last 180 days)
    const now = new Date();
    const startDate = new Date(now.setDate(now.getDate() - 180))
      .toISOString()
      .split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];

    console.log(`📅 Date Range: ${startDate} to ${endDate}`);

    // Fetch transactions from Plaid
    let allTransactions: any[] = [];
    let hasMore = true;
    let offset = 0;

    while (hasMore) {
      console.log(`📡 Fetching transactions (offset: ${offset})...`);
      
      const response = await plaidClient.transactionsGet({
        access_token: item.access_token,
        start_date: startDate,
        end_date: endDate,
        options: {
          count: 100,
          offset: offset,
        },
      });

      const transactions = response.data.transactions;
      allTransactions = [...allTransactions, ...transactions];
      
      hasMore = response.data.total_transactions > allTransactions.length;
      offset += transactions.length;
    }

    console.log(`📊 Received ${allTransactions.length} transactions`);

    // Check existing transactions
    const plaidTransactionIds = allTransactions.map(txn => txn.transaction_id);
    const { data: existingTransactions } = await supabase
      .from('plaid_transactions')
      .select('transaction_id')
      .in('transaction_id', plaidTransactionIds)
      .eq('plaid_item_id', item.id);

    const existingTransactionIds = new Set(
      existingTransactions?.map(txn => txn.transaction_id) || []
    );

    // Prepare data for upsert
    const transactionsToUpsert = allTransactions.map(transaction => ({
      plaid_item_id: item.id,
      user_id: item.user_id,
      account_id: transaction.account_id,
      transaction_id: transaction.transaction_id,
      account_owner: transaction.account_owner || null,
      amount: transaction.amount,
      authorized_date: transaction.authorized_date || null,
      authorized_datetime: transaction.authorized_datetime || null,
      category: transaction.category || null,
      category_id: transaction.category_id || null,
      check_number: transaction.check_number || null,
      counterparties: transaction.counterparties || null,
      date: transaction.date,
      datetime: transaction.datetime || null,
      iso_currency_code: transaction.iso_currency_code || null,
      location: transaction.location || null,
      logo_url: transaction.logo_url || null,
      merchant_entity_id: transaction.merchant_entity_id || null,
      merchant_name: transaction.merchant_name || null,
      name: transaction.name,
      payment_channel: transaction.payment_channel || null,
      payment_meta: transaction.payment_meta || null,
      pending: transaction.pending || false,
      pending_transaction_id: transaction.pending_transaction_id || null,
      personal_finance_category: transaction.personal_finance_category || null,
      personal_finance_category_icon_url: transaction.personal_finance_category_icon_url || null,
      transaction_code: transaction.transaction_code || null,
      transaction_type: transaction.transaction_type || null,
      unofficial_currency_code: transaction.unofficial_currency_code || null,
      website: transaction.website || null,
      updated_at: new Date().toISOString(),
    }));

    // Perform upsert in batches (Supabase has limits)
    const BATCH_SIZE = 100;
    let inserted = 0;
    let updated = 0;

    for (let i = 0; i < transactionsToUpsert.length; i += BATCH_SIZE) {
      const batch = transactionsToUpsert.slice(i, i + BATCH_SIZE);
      
      const { error: upsertError } = await supabase
        .from('plaid_transactions')
        .upsert(batch, {
          onConflict: 'transaction_id',
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error('❌ Upsert error in batch:', upsertError);
        throw upsertError;
      }

      // Count inserts vs updates
      batch.forEach(txn => {
        if (existingTransactionIds.has(txn.transaction_id)) {
          updated++;
        } else {
          inserted++;
        }
      });

      console.log(`  Processed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(transactionsToUpsert.length / BATCH_SIZE)}`);
    }

    const result = {
      success: true,
      count: allTransactions.length,
      inserted,
      updated,
    };

    console.log('✅ Transaction sync complete:', result);
    return result;

  } catch (error: any) {
    console.error('\n❌ Error syncing transactions:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sync Plaid recurring transactions to plaid_recurring_transactions table
 */
async function syncPlaidRecurringTransactions(item: any): Promise<SyncResult> {
  console.log('\n🔁 SYNCING RECURRING TRANSACTIONS');
  
  try {
    // Fetch recurring transactions from Plaid
    console.log('📡 Calling Plaid transactionsRecurringGet API...');
    
    const response = await plaidClient.transactionsRecurringGet({
      access_token: item.access_token,
    });

    console.log('✅ Plaid API response received');
    
    const allStreams = [
      ...(response.data.outflow_streams || [])
    ];
    
    console.log(`📊 Received ${allStreams.length} recurring transaction streams`);

    // Check existing streams
    const streamIds = allStreams.map(stream => stream.stream_id);
    const { data: existingStreams } = await supabase
      .from('plaid_recurring_transactions')
      .select('stream_id')
      .in('stream_id', streamIds)
      .eq('plaid_item_id', item.id);

    const existingStreamIds = new Set(
      existingStreams?.map(stream => stream.stream_id) || []
    );

    // Prepare data for upsert
    const streamsToUpsert = allStreams.map(stream => ({
      plaid_item_id: item.id,
      user_id: item.user_id,
      account_id: stream.account_id,
      stream_id: stream.stream_id,
      average_amount: stream.average_amount || null,
      category: stream.category || null,
      category_id: stream.category_id || null,
      description: stream.description || null,
      first_date: stream.first_date,
      frequency: stream.frequency,
      is_active: stream.is_active || false,
      is_user_modified: stream.is_user_modified || false,
      last_amount: stream.last_amount || null,
      last_date: stream.last_date,
      last_user_modified_datetime: stream.last_user_modified_datetime || null,
      merchant_name: stream.merchant_name || null,
      personal_finance_category: stream.personal_finance_category || null,
      predicted_next_date: stream.predicted_next_date || null,
      status: stream.status,
      transaction_ids: stream.transaction_ids || [],
      updated_at: new Date().toISOString(),
    }));

    // Perform upsert
    const { error: upsertError } = await supabase
      .from('plaid_recurring_transactions')
      .upsert(streamsToUpsert, {
        onConflict: 'stream_id',
        ignoreDuplicates: false,
      });

    if (upsertError) {
      console.error('❌ Upsert error:', upsertError);
      throw upsertError;
    }

    const result = {
      success: true,
      count: allStreams.length,
      inserted: allStreams.length - existingStreamIds.size,
      updated: existingStreamIds.size,
    };

    console.log('✅ Recurring transaction sync complete:', result);
    return result;

  } catch (error: any) {
    // Check if recurring transactions are not enabled
    if (error.response?.data?.error_code === 'PRODUCT_NOT_ENABLED') {
      console.log('⚠️  Recurring transactions not enabled for this item');
      return { 
        success: true, 
        count: 0, 
        message: 'Recurring transactions not enabled' 
      };
    }
    
    console.error('\n❌ Error syncing recurring transactions:', error.message);
    return { success: false, error: error.message };
  }
}
