import React from "react";
import { List, Typography } from "antd";
import { Link } from "react-router-dom";
import { stages } from "../../../data/studyStages";

const { Title } = Typography;

const StagesOfMentoringStudentPage = () => {
  return (
    <div style={{ maxWidth: "800px", textAlign: "center", margin: "0 auto" }}>
      <Title level={2}>ШӘКІРТ ТӘРБИЕЛЕУ КЕЗЕҢДЕРІ</Title>
      <List
        bordered
        dataSource={stages}
        renderItem={(stage) => (
          <List.Item>
            <Link to={`/stagesOfMentoringStudent/${stage.id}`}>
              {stage.title}
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
};

export default StagesOfMentoringStudentPage;
