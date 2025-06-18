import { Col, Space, Button } from "antd";

const LanguageSwitcher = ({ language, setLanguage }) => {
  const languages = ["ru", "en", "kz", "tk"];

  return (
    <Col span={24} style={{ marginBottom: 16 }}>
      <Space>
        {languages.map((lang) => (
          <Button
            key={lang}
            type={language === lang ? "primary" : "default"}
            onClick={() => setLanguage(lang)}
          >
            {lang.toUpperCase()}
          </Button>
        ))}
      </Space>
    </Col>
  );
};

export default LanguageSwitcher;
