import { ThemeToggle } from '../components/ThemeToggle.jsx';

export function DemoLanding({ onOpenChat }) {
  return (
    <div className="demo">
      <header className="demo__header">
        <span className="demo__logo">iThech</span>
        <ThemeToggle />
      </header>

      <section className="demo__hero">
        <h1>Умный чат для вашего сайта</h1>
        <p className="demo__hero-lead">
          ИИ-ассистент отвечает клиентам круглосуточно, собирает заявки и передаёт сложные
          вопросы операторам.
        </p>
        <p className="demo__hero-detail">
          Он опирается на вашу базу знаний: тарифы, доставка, возвраты, инструкции по
          подключению. Подсказывает быстрые ответы, уточняет детали и фиксирует контакты, если
          нужен живой специалист. Настройка занимает минуты — без отдельного мобильного
          приложения для посетителей.
        </p>
        <ul className="demo__hero-points">
          <li>Ответ за 1–3 секунды на типовые вопросы</li>
          <li>Быстрые кнопки «Цены», «Подключение», «Оператор»</li>
          <li>История диалога и передача чата менеджеру в один клик</li>
          <li>Работает на десктопе и телефоне, светлая и тёмная тема</li>
        </ul>
        <button type="button" className="demo__cta" onClick={onOpenChat}>
          Открыть чат
        </button>
      </section>

      <section className="demo__features" aria-label="Возможности">
        <article className="demo__card">
          <h3>Мгновенные ответы</h3>
          <p>Типовые вопросы закрываются за секунды без очереди в поддержку.</p>
        </article>
        <article className="demo__card">
          <h3>Подключение за 5 минут</h3>
          <p>Один скрипт на сайт — чат появляется в правом нижнем углу.</p>
        </article>
        <article className="demo__card">
          <h3>Живые операторы</h3>
          <p>При необходимости диалог плавно передаётся человеку из вашей команды.</p>
        </article>
      </section>
    </div>
  );
}
