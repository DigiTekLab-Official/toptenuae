"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Trophy, Zap, Leaf, ShieldCheck } from "lucide-react";
import { listImage } from "@/sanity/lib/image"; // Ensure this path matches yours

interface ListItem {
  _key: string;
  rank: number;
  itemName: string;
  itemImage?: any;
  bestFor?: string;
  affiliateLink?: string;
}

export default function QuickSummaryTable({ items }: { items: ListItem[] }) {
  // Only show the Top 5 to keep it "Quick"
  const topPicks = items.slice(0, 5);

  return (
    <div className="mb-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Quick Comparison: Top 5 Picks (2026)
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-white text-sm uppercase text-gray-500 font-bold tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Best For</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {topPicks.map((item) => {
               const imageUrl = item.itemImage ? listImage(item.itemImage) : null;
               
               return (
                <tr key={item._key} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-black text-gray-900">
                    #{item.rank}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {imageUrl && (
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                          <Image 
                            src={imageUrl} 
                            alt={item.itemName} 
                            fill 
                            className="object-contain p-1"
                          />
                        </div>
                      )}
                      <span className="font-bold text-gray-900 line-clamp-2 md:whitespace-nowrap">
                        {item.itemName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.bestFor && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-sm font-bold text-violet-700">
                        {item.rank === 1 ? <Trophy className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                        {item.bestFor}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a 
                      href={`#item-${item.rank}`} 
                      className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Review <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-200">
        <span className="text-sm font-medium text-gray-500">
          *We tested 20+ brands to find these winners.
        </span>
      </div>
    </div>
  );
}