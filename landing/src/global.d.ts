declare module '*.css' {
  const content: { [className: string]: string } | void;
  export default content;
}
