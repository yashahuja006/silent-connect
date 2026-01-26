'use client'

import { Toaster as Sonner } from 'sonner'
import { useTheme } from 'next-themes'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-glass group-[.toaster]:text-white group-[.toaster]:border-glass-border group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-md',
          description: 'group-[.toast]:text-gray-300',
          actionButton:
            'group-[.toast]:bg-electric-500 group-[.toast]:text-white group-[.toast]:hover:bg-electric-600',
          cancelButton:
            'group-[.toast]:bg-gray-600 group-[.toast]:text-gray-200 group-[.toast]:hover:bg-gray-700',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }