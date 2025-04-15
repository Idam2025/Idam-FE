import style from "./mainNavigationbar.module.css";

export default function NavigationBar() {
  return (
    <div className={style.container}>
      <div className={style.font}>IDAM</div>
      <div className={style.row}>
        <div className={style.font}>Home</div>
        <div className={style.font}>Artist</div>
        <div className={style.font}>Contact</div>
      </div>
    </div>
  );
}
