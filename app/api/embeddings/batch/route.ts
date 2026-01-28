// app/api/embeddings/batch/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase as supabaseAdmin } from '../../../../lib/supabase'
import { createEmbedding } from '../../../../lib/embeddings'
import {
  createTransactionEmbeddingText,
  createInvestmentEmbeddingText,
  createRecurringEmbeddingText
} from '../../../../lib/embedding-text-generators'

// USE Node.js runtime (not Edge)
// export const runtime = 'nodejs' // This is default, no need to specify
export const maxDuration = 300 // 5 minutes for first load
export const dynamic = 'force-dynamic'

interface BatchStats {
  transactions: { processed: number; skipped: number; errors: number }
  investments: { processed: number; skipped: number; errors: number }
  recurring: { processed: number; skipped: number; errors: number }
  totalTime: number
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await req.json()
    const { 
      userId, 
      batchSize = 10, // Start small for testing
      sourceTable
    } = body
    
    console.log('📊 Starting batch embedding creation...')
    console.log('⚠️  First run will take 1-2 minutes to download model...')
    
    const stats: BatchStats = {
      transactions: { processed: 0, skipped: 0, errors: 0 },
      investments: { processed: 0, skipped: 0, errors: 0 },
      recurring: { processed: 0, skipped: 0, errors: 0 },
      totalTime: 0
    }
    
    // Process each table type
    if (!sourceTable || sourceTable === 'transaction') {
      await processTransactions(userId, batchSize, stats)
    }
    
    if (!sourceTable || sourceTable === 'investment') {
      await processInvestments(userId, batchSize, stats)
    }
    
    if (!sourceTable || sourceTable === 'recurring_transaction') {
      await processRecurringTransactions(userId, batchSize, stats)
    }
    
    stats.totalTime = Date.now() - startTime
    
    const totalProcessed = getTotalProcessed(stats)
    
    console.log(`✅ Batch complete: ${totalProcessed} records in ${stats.totalTime}ms`)
    
    return NextResponse.json({
      success: true,
      stats,
      message: `Processed ${totalProcessed} records in ${stats.totalTime}ms`,
      note: 'Using FREE local embeddings (WASM) - $0 cost!'
    })
    
  } catch (error: any) {
    console.error('❌ Batch embedding error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// ... rest of the functions (same as before)

async function processTransactions(
  userId: string | undefined,
  batchSize: number,
  stats: BatchStats
) {
  console.log('🔄 Processing transactions...')
  
  let query = supabaseAdmin
    .from('plaid_transactions')
    .select('id, user_id, merchant_name, amount, date, category, personal_finance_category, payment_channel')
    .limit(batchSize)
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data: allTransactions, error: fetchError } = await query
  
  if (fetchError) {
    console.error('Error fetching transactions:', fetchError)
    return
  }
  
  if (!allTransactions || allTransactions.length === 0) {
    console.log('✓ No transactions to process')
    return
  }
  
  console.log(`Found ${allTransactions.length} transactions`)
  
  // Check which already have embeddings
  const { data: existingEmbeddings } = await supabaseAdmin
    .from('embeddings')
    .select('source_id')
    .eq('source_table', 'transaction')
    .in('source_id', allTransactions.map(t => t.id))
  
  const existingIds = new Set(existingEmbeddings?.map(e => e.source_id) || [])
  const transactionsToProcess = allTransactions.filter(t => !existingIds.has(t.id))
  
  stats.transactions.skipped = allTransactions.length - transactionsToProcess.length
  console.log(`Processing ${transactionsToProcess.length} new transactions`)
  
  // Process each transaction
  for (let i = 0; i < transactionsToProcess.length; i++) {
    const txn = transactionsToProcess[i]
    
    try {
      console.log(`  Processing transaction ${i + 1}/${transactionsToProcess.length}...`)
      
      // Create embedding text
      const embeddingText = createTransactionEmbeddingText(txn)
      
      // Generate embedding (FREE, WASM!)
      const embedding = await createEmbedding(embeddingText)
      
      console.log(`  ✓ Generated embedding (${embedding.length} dimensions)`)
      
      // Insert to embeddings table
      const { error: insertError } = await supabaseAdmin
        .from('embeddings')
        .insert({
          user_id: txn.user_id,
          source_table: 'transaction',
          source_id: txn.id,
          embedding,
          embedding_text: embeddingText,
          metadata: {
            amount: parseFloat(txn.amount),
            date: txn.date,
            category: txn.category,
            merchant: txn.merchant_name
          }
        })
      
      if (insertError) {
        console.error('  ✗ Insert error:', insertError)
        stats.transactions.errors++
      } else {
        stats.transactions.processed++
        console.log(`  ✓ Saved to database`)
      }
      
    } catch (error: any) {
      console.error('  ✗ Transaction processing error:', error.message)
      stats.transactions.errors++
    }
  }
  
  console.log(`✅ Transactions complete: ${stats.transactions.processed} processed`)
}

async function processInvestments(
  userId: string | undefined,
  batchSize: number,
  stats: BatchStats
) {
  console.log('🔄 Processing investments...')
  
  let query = supabaseAdmin
    .from('plaid_investments')
    .select('id, user_id, security_name, symbol, account_name, account_type, account_subtype, quantity, price, value, cost_basis, institution_name')
    .limit(batchSize)
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data: allInvestments } = await query
  
  if (!allInvestments || allInvestments.length === 0) {
    console.log('✓ No investments to process')
    return
  }
  
  const { data: existingEmbeddings } = await supabaseAdmin
    .from('embeddings')
    .select('source_id')
    .eq('source_table', 'investment')
    .in('source_id', allInvestments.map(i => i.id))
  
  const existingIds = new Set(existingEmbeddings?.map(e => e.source_id) || [])
  const investmentsToProcess = allInvestments.filter(i => !existingIds.has(i.id))
  
  stats.investments.skipped = allInvestments.length - investmentsToProcess.length
  console.log(`Processing ${investmentsToProcess.length} new investments`)
  
  for (let i = 0; i < investmentsToProcess.length; i++) {
    const inv = investmentsToProcess[i]
    
    try {
      console.log(`  Processing investment ${i + 1}/${investmentsToProcess.length}...`)
      
      const embeddingText = createInvestmentEmbeddingText(inv)
      const embedding = await createEmbedding(embeddingText)
      
      const { error: insertError } = await supabaseAdmin
        .from('embeddings')
        .insert({
          user_id: inv.user_id,
          source_table: 'investment',
          source_id: inv.id,
          embedding,
          embedding_text: embeddingText,
          metadata: {
            value: parseFloat(inv.value),
            symbol: inv.symbol,
            account_type: inv.account_type
          }
        })
      
      if (insertError) {
        console.error('  ✗ Insert error:', insertError)
        stats.investments.errors++
      } else {
        stats.investments.processed++
        console.log(`  ✓ Saved to database`)
      }
      
    } catch (error: any) {
      console.error('  ✗ Investment processing error:', error.message)
      stats.investments.errors++
    }
  }
  
  console.log(`✅ Investments complete: ${stats.investments.processed} processed`)
}

async function processRecurringTransactions(
  userId: string | undefined,
  batchSize: number,
  stats: BatchStats
) {
  console.log('🔄 Processing recurring transactions...')
  
  let query = supabaseAdmin
    .from('plaid_recurring_transactions')
    .select('id, user_id, description, merchant_name, frequency, status, average_amount, personal_finance_category, first_date, last_date')
    .limit(batchSize)
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data: allRecurring } = await query
  
  if (!allRecurring || allRecurring.length === 0) {
    console.log('✓ No recurring transactions to process')
    return
  }
  
  const { data: existingEmbeddings } = await supabaseAdmin
    .from('embeddings')
    .select('source_id')
    .eq('source_table', 'recurring_transaction')
    .in('source_id', allRecurring.map(r => r.id))
  
  const existingIds = new Set(existingEmbeddings?.map(e => e.source_id) || [])
  const recurringToProcess = allRecurring.filter(r => !existingIds.has(r.id))
  
  stats.recurring.skipped = allRecurring.length - recurringToProcess.length
  console.log(`Processing ${recurringToProcess.length} new recurring transactions`)
  
  for (let i = 0; i < recurringToProcess.length; i++) {
    const rec = recurringToProcess[i]
    
    try {
      console.log(`  Processing recurring ${i + 1}/${recurringToProcess.length}...`)
      
      const embeddingText = createRecurringEmbeddingText(rec)
      const embedding = await createEmbedding(embeddingText)
      
      const { error: insertError } = await supabaseAdmin
        .from('embeddings')
        .insert({
          user_id: rec.user_id,
          source_table: 'recurring_transaction',
          source_id: rec.id,
          embedding,
          embedding_text: embeddingText,
          metadata: {
            frequency: rec.frequency,
            status: rec.status
          }
        })
      
      if (insertError) {
        console.error('  ✗ Insert error:', insertError)
        stats.recurring.errors++
      } else {
        stats.recurring.processed++
        console.log(`  ✓ Saved to database`)
      }
      
    } catch (error: any) {
      console.error('  ✗ Recurring processing error:', error.message)
      stats.recurring.errors++
    }
  }
  
  console.log(`✅ Recurring complete: ${stats.recurring.processed} processed`)
}

function getTotalProcessed(stats: BatchStats): number {
  return stats.transactions.processed + 
         stats.investments.processed + 
         stats.recurring.processed
}