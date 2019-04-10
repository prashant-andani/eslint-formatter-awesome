import { h } from 'preact';
import style from './style';

const Card = ({ data, severity, ruleId = null }) => (
  <div style={{ marginTop: '20px' }}>
    {data &&
      data.messages.map(
        each =>
          severity == each.severity &&
          ruleId == each.ruleId && (
            <div className={style.card}>
              <div className={style.title}>{each.message}</div>
              <div className={style['rule-id']}>{each.ruleId}</div>
              <div className={style['file-path']}>{data.filePath}</div>
            </div>
          )
      )}
  </div>
);

export default Card;
