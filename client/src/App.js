//const serverURL = "http://13.55.139.143:3000/resize"
import Header from './components/Header';
import Upload from "./components/Upload";

import styles from "./css/App.module.css";

function App() {
  return (
    <div className={styles.body}>
      <Header />
      <Upload />
    </div>
  );
}

export default App;
