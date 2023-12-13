import { Button } from "./Button";

import styles from "./Error.module.css";

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
