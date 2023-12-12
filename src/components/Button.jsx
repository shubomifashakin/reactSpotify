export function Button({ children, onClickFn }) {
  return (
    <button className={`btn-1`} type="button" onClick={onClickFn}>
      {children}
    </button>
  );
}
