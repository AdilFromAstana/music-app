import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel, Button } from "antd";

const { Header, Content } = Layout;
const { Title } = Typography;

const composers = [
  {
    name: "Биржан Сал Кожагулулы",
    image: "birjan.jpg",
    bio: "Описание Биржана Сала...",
  },
  {
    name: "Акан Сери Корамсаулы",
    image: "akan.jpg",
    bio: "Описание Акана Сери...",
  },
  {
    name: "Жаяу Муса Байжанулы",
    image: "zhayau.jpg",
    bio: "Описание Жаяу Мусы...",
  },
  {
    name: "Жарылгапберди Жумабайулы",
    image: "zharylgap.jpg",
    bio: "Описание Жарылгапберди...",
  },
  {
    name: "Мухаметжан Майбасарулы",
    image: "muhametjan.jpg",
    bio: "Описание Мухаметжана...",
  },
  {
    name: "Укили Ыбырай Сандыбайулы",
    image: "ukili.jpg",
    bio: "Описание Ыбырая...",
  },
  {
    name: "Балуан Шолак (Нурмаганбет) Баймырзаулы",
    image: "baluansholak.jpg",
    bio: "Описание Балуана Шолака...",
  },
  { name: "Естай Беркимбайулы", image: "estay.jpg", bio: "Описание Естая..." },
];

const sections = {
  home: "Арқа певческая школа \r\nЭлектронное учебное пособие по специальности традиционного пения",
  composers: composers,
  recordings: composers.map((comp) => `Аудиозапись - ${comp.name}`),
  notes: composers.map((comp) => `Ноты - ${comp.name}`),
};

const App = () => {
  const [selectedSection, setSelectedSection] = useState("home");
  const [selectedComposer, setSelectedComposer] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["home"]}
        onClick={(e) => {
          setSelectedSection(e.key);
          setSelectedComposer(null);
        }}
        style={{ display: "flex", justifyContent: "center" }}
        items={[
          { key: "home", label: "Арқа певческая школа" },
          { key: "composers", label: "Народные композиторы" },
          { key: "recordings", label: "Аудиозаписи" },
          { key: "notes", label: "Ноты" },
        ]}
      />
      <Content
        style={{
          padding: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ maxWidth: "800px" }}
          >
            {selectedComposer ? (
              <div>
                <img
                  src={selectedComposer.image}
                  alt={selectedComposer.name}
                  style={{ width: "100%", borderRadius: "10px" }}
                />
                <h2>{selectedComposer.name}</h2>
                <p>{selectedComposer.bio}</p>
                <Button
                  type="primary"
                  onClick={() => setSelectedComposer(null)}
                >
                  Назад
                </Button>
              </div>
            ) : Array.isArray(sections[selectedSection]) ? (
              isMobile ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {sections[selectedSection].map((comp) => (
                    <li
                      key={comp.name}
                      style={{ padding: "10px", cursor: "pointer" }}
                      onClick={() => setSelectedComposer(comp)}
                    >
                      <img
                        src={comp.image}
                        alt={comp.name}
                        style={{ width: "100%", borderRadius: "10px" }}
                      />
                      <p>{comp.name}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <Carousel
                  dots={false}
                  slidesToShow={3}
                  slidesToScroll={1}
                  autoplay
                >
                  {sections[selectedSection].map((comp) => (
                    <div
                      key={comp.name}
                      style={{ padding: "10px", cursor: "pointer" }}
                      onClick={() => setSelectedComposer(comp)}
                    >
                      <img
                        src={comp.image}
                        alt={comp.name}
                        style={{ width: "100%", borderRadius: "10px" }}
                      />
                      <p>{comp.name}</p>
                    </div>
                  ))}
                </Carousel>
              )
            ) : (
              <p style={{ fontSize: "22px", fontWeight: "bold" }}>
                {sections[selectedSection]}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </Content>
    </Layout>
  );
};

export default App;
