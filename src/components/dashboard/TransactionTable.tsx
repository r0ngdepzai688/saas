import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
  ExternalLink,
  Check,
  Copy
} from 'lucide-react';
import { RECENT_TRANSACTIONS } from '../../data/mockData';
import type { Transaction } from '../../types/dashboard';

interface TransactionTableProps {
  searchFilter: string;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ searchFilter }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'processing' | 'refunded'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTransactions = RECENT_TRANSACTIONS.filter((tx) => {
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesSearch =
      tx.customerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tx.invoice.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tx.customerEmail.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="glass-badge bg-sage-100/90 text-sage-800 border-sage-200">
            <CheckCircle2 className="w-3 h-3 text-sage-600 mr-1" />
            Settled
          </span>
        );
      case 'processing':
        return (
          <span className="glass-badge bg-amberwarm-100/90 text-amberwarm-800 border-amberwarm-200">
            <Clock className="w-3 h-3 text-amberwarm-600 mr-1" />
            In Clearing
          </span>
        );
      case 'refunded':
        return (
          <span className="glass-badge bg-coral-100/90 text-coral-800 border-coral-200">
            <RotateCcw className="w-3 h-3 text-coral-600 mr-1" />
            Reversed
          </span>
        );
      default:
        return (
          <span className="glass-badge bg-warm-200 text-warm-700">
            <XCircle className="w-3 h-3 text-warm-500 mr-1" />
            Unknown
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-6"
    >
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-bold text-warm-900">Enterprise Inflow Ledger</h3>
          <p className="text-xs text-warm-600 mt-0.5">Verified multi-tenant subscription receipts & settlements</p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-warm-200/60 border border-warm-300/50 backdrop-blur-md self-start sm:self-auto overflow-x-auto max-w-full">
          {(['all', 'completed', 'processing', 'refunded'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-white text-warm-900 shadow-sm border border-warm-200'
                  : 'text-warm-600 hover:text-warm-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-warm-200/70 bg-white/40">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-warm-200/80 bg-warm-100/60 text-warm-700 font-semibold tracking-wide">
              <th className="py-3 px-4">Invoice / ID</th>
              <th className="py-3 px-4">Enterprise Client</th>
              <th className="py-3 px-4">Tier Plan</th>
              <th className="py-3 px-4">Volume (USD)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Settlement Time</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-100/80">
            <AnimatePresence>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/75 transition-colors duration-150 group"
                  >
                    {/* Invoice ID */}
                    <td className="py-3.5 px-4 font-mono font-medium text-warm-900">
                      <div className="flex items-center gap-1.5">
                        <span>{tx.invoice}</span>
                        <button
                          onClick={() => handleCopy(tx.id, tx.invoice)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-warm-400 hover:text-warm-700 rounded transition-opacity"
                          title="Copy Invoice Number"
                        >
                          {copiedId === tx.id ? (
                            <Check className="w-3 h-3 text-sage-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Customer Info with Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={tx.avatar}
                          alt={tx.customerName}
                          className="w-7 h-7 rounded-lg object-cover border border-warm-200 shadow-sm shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-warm-900">{tx.customerName}</p>
                          <p className="text-[11px] text-warm-500">{tx.customerEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-warm-800 px-2 py-0.5 rounded-md bg-warm-200/50 border border-warm-300/50 text-[11px]">
                        {tx.plan}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-bold text-warm-900 tabular-nums">
                      ${tx.amount.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(tx.status)}
                    </td>

                    {/* Date & Payment Method */}
                    <td className="py-3.5 px-4 text-warm-600">
                      <p className="font-medium">{tx.date}</p>
                      <p className="text-[10px] text-warm-400">{tx.paymentMethod}</p>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert(`Reviewing settlement dossier for ${tx.customerName} (${tx.invoice})`)}
                        className="p-1.5 rounded-lg text-warm-500 hover:text-terracotta-700 hover:bg-terracotta-50 transition-all inline-flex items-center gap-1"
                        title="View Audit Record"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-warm-500">
                    <p className="font-medium">No transactions match your current query.</p>
                    <button
                      onClick={() => setStatusFilter('all')}
                      className="mt-2 text-xs font-semibold text-terracotta-600 hover:underline"
                    >
                      Reset status filter
                    </button>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
