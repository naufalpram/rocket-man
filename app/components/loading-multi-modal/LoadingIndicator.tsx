const LoadingIndicator = ({ size = 'sm' }: { size: 'sm' | 'md' | 'lg' }) => {
  const fontSize = {
    sm: '0.5rem',
    md: '2.5rem',
    lg: '4rem'
  }
  return (
    <div className={`loading-indicator font-[${fontSize[size]}]`}>
        <span>.</span>
        <span>.</span>
        <span>.</span>
    </div>
  )
}

export default LoadingIndicator;