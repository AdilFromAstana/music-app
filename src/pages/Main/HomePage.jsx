import React from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <div style={{ maxWidth: "800px", textAlign: "center", margin: "0 auto" }}>
      <Title level={1} style={{ fontSize: "56px" }}>
        Арқа әншілік мектебі
      </Title>
      <Title level={3} style={{ fontWeight: 400 }}>
        Дәстүрлі ән мамандығы бойынша электронды оқу құралы
      </Title>
      <br />
      <br />
      <Title level={5}>
        АВТОРЛАР <br />
        <br />
        Идея авторы: Қазақстанның еңбек сіңірген қайраткері, профессор — <br />
        Алмасбек Нұрмаханұлы Алматов
        <br />
        <br />
        Құрастырушы автор: Республикалық байқаулардың лауреаты — <br />
        Смағұлова Замзагүл Талғатқызы
        <br />
        <br />
        Техникалық автор: веб-бағдарламашы — <br />
        Айжанов Әділ Ерболұлы
      </Title>
    </div>
  );
};

export default HomePage;
