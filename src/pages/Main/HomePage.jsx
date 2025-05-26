import React from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <div style={{ maxWidth: "800px", textAlign: "center", margin: "0 auto" }}>
      <Title level={2}>Арқа әншілік мектебі</Title>
      <Paragraph>Дәстүрлі ән мамандығы бойынша электронды оқу құралы</Paragraph>
      <Title level={2}>
        АВТОРЛАР <br />
        <br />
        Идея авторы: Қазақстанның еңбек сіңірген қайраткері, профессор —
        Алмасбек Нұрмаханұлы Алматов
        <br />
        <br />
        Құрастырушы автор: Республикалық байқаулардың лауреаты — Смағұлова
        Замзагүл Талғатқызы
        <br />
        <br />
        Техникалық автор: веб-бағдарламашы — Айжанов Әділ Ерболұлы
      </Title>
    </div>
  );
};

export default HomePage;
