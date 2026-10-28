import * as React from 'react';
import { cn } from '@/lib/utils';
export function Input({className,type,...props}:React.ComponentProps<'input'>){return <input type={type} className={cn('flex h-12 w-full rounded-2xl border border-white/15 bg-white/[.035] px-4 py-2 text-base outline-none placeholder:text-white/35 focus-visible:border-[#f3df50] focus-visible:ring-1 focus-visible:ring-[#f3df50] disabled:opacity-50',className)} {...props}/>}
