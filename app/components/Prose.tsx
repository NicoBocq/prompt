import {HTMLAttributes, PropsWithChildren} from 'react'

import clsx from 'clsx'

function Prose({
  children,
  className,
}: PropsWithChildren & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(className, 'prose whitespace-pre-line dark:prose-invert')}
    >
      {children}
    </div>
  )
}

export default Prose
