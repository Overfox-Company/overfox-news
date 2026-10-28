import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const buttonVariants = cva('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f3df50] disabled:pointer-events-none disabled:opacity-50', {variants:{variant:{default:'bg-[#f3df50] text-[#171815] hover:bg-[#ffed6d]',secondary:'bg-white/10 text-white hover:bg-white/15',outline:'border border-white/20 bg-transparent hover:bg-white/10',ghost:'hover:bg-white/10',destructive:'bg-red-500/15 text-red-300 hover:bg-red-500/25',link:'underline-offset-4 hover:underline'},size:{default:'h-11 px-5 py-2',sm:'h-9 px-4 text-xs',lg:'h-12 px-7',icon:'h-11 w-11'}},defaultVariants:{variant:'default',size:'default'}});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants>{asChild?:boolean}
export function Button({className,variant,size,asChild=false,...props}:ButtonProps){const Comp=asChild?Slot:'button';return <Comp className={cn(buttonVariants({variant,size,className}))} {...props}/>}
export {buttonVariants};
