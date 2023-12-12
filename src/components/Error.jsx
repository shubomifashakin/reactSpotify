import styles from "../CssModules/error.module.css";
import { Button } from "./Button";

export function ErrorComponent({ message, failure = true, onClickFn }) {
  return (
    <>
      <div className={styles.errorContainer}>
        <p className={styles.notice}>{message}</p>
        {failure ? <Button onClickFn={onClickFn}>Try Again</Button> : null}
      </div>
    </>
  );
}
