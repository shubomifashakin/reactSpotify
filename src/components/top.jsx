import styles from "../CssModules/topContainer.module.css";

function TopContainer({ children }) {
  return <section className={styles.topContainer}>{children}</section>;
}
export default TopContainer;
