export function HeroBackground() {
  return (
    <div className="absolute top-0 right-0 -z-10 h-full w-full opacity-30 dark:opacity-10">
      <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-[10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-accent/20 blur-[100px]" />
    </div>
  )
}
