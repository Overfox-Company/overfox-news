import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {cn} from '@/lib/utils';
const badgeVariants=cva('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',{variants:{variant:{default:'bg-[#f3df50] text-black',secondary:'bg-white/10 text-white/80',outline:'border border-white/20 text-white/70',destructive:'bg-red-500/20 text-red-300'}},defaultVariants:{variant:'default'}});
export function Badge({className,variant,...props}:React.HTMLAttributes<HTMLDivElement>&VariantProps<typeof badgeVariants>){return <div className={cn(badgeVariants({variant}),className)} {...props}/>}
