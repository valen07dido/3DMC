import CardConoceMas from "@/Components/CardConoceMas/CardConoceMas";
import styles from "./page.module.css";
import Carousel from "@/Components/Carousel/Carousel";
import img1 from "@/public/products/goku/goku1.png";
import img2 from "@/public/products/groot/groot1.png";
import img3 from "@/public/products/batman/batman1.png";
import img4 from "../public/products/harry_potter/harrypotter1.png";
import img5 from "../public/products/trex/trex1.png";
import HorizontalCard from "@/Components/HorizontalCard/HorizontalCard";
import MapComponent from "@/Components/Map/Map";

export default function Home() {
  const arr = [
    {
      img: img1,
      text: "Goku",
    },
    {
      img: img2,
      text: "Groot articulado",
    },
  ];
  const horizontalArr = [
    {
      img: img5,
      title: "T-REX",
      text: "Un poderoso tiranosaurio para espantar a todas tus visitas!",
      orientation: "D",
    },
    {
      img: img3,
      title: "Batman",
      text: "Figura de accion super-realista del caballero de la noche",
      orientation: "D",
    },
    {
      img: img4,
      title: "Funko Harry Potter",
      text: "Un Excelente adorno para tener en tu repisa y coleccionarlos",
      orientation: "I",
    },
  ];
  return (
    <main className={styles.main}>
      <div className={styles.banner}>
        <h1 className={styles.title}>Soluciones 3D</h1>
      </div>
      <div>
        <h1 className={styles.title2}>Conocénos</h1>
      </div>
      <div className={styles.carousel}>
        <Carousel className={styles.carouselcomp} />
      </div>
      <div className={styles.products}>
        {arr.map((item, index) => (
          <div key={index} className={styles.cardContainer}>
            <CardConoceMas img={item.img} text={item.text} />
          </div>
        ))}
      </div>
      <div className={styles.products}>
        {horizontalArr.map((item, index) => (
          <div key={index}>
            <HorizontalCard
              img={item.img}
              text={item.text}
              title={item.title}
              orientation={item.orientation}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
