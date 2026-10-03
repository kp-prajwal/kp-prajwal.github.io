export const identity = {
  name: 'Prajwal Kulkarni',
  intro: 'I build data platforms and useful AI systems.',
  description: 'Data engineer in Dallas, Texas. I turn complex data into systems people can actually use.',
  email: 'prajwalkp.work@gmail.com',
  resume: 'https://drive.google.com/file/d/1N89xlV2oKfDbqZioWEmdApceewK9ftff/view?usp=sharing',
  links: [
    { label: 'GitHub', href: 'https://github.com/kp-prajwal' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/prajwal-kp/' },
    { label: 'Résumé', href: 'https://drive.google.com/file/d/1N89xlV2oKfDbqZioWEmdApceewK9ftff/view?usp=sharing' },
  ],
};

export const work = [
  {
    slug: 'albertsons', title: 'Albertsons Companies', role: 'AI Data Engineer',
    period: 'June 2025 — August 2026', category: 'Data platform / applied AI',
    teaser: 'A finance data platform for 2,500+ stores.',
    summary: 'I helped build a new finance data platform that gave teams a more reliable view of performance across thousands of stores.',
    paragraphs: [
      'The work started with a greenfield Databricks platform spanning GCP and Azure. I built and productionized PySpark and SQL pipelines for profit-and-loss reporting, with historical backfills and incremental runs for weekly and quarterly cycles.',
      'The platform produced 40 standardized P&L metrics. Some pipelines processed over a billion records per P&L line, so modeling choices mattered: partitioning and materialized views removed redundant full-table scans from critical workloads.',
      'I also built Power BI views for allocation, forecast, and variance analysis, and shipped two applied-AI capabilities: anomaly detection for financial KPIs and a natural-language variance summarizer. The useful part was making the data ready for decisions, not simply moving it.',
    ],
    metric: '40+', metricLabel: 'production data pipelines',
    tags: ['Databricks', 'PySpark', 'SQL', 'Power BI', 'GCP', 'Azure'],
  },
  {
    slug: 'generativeproduct', title: 'GenerativeProduct.io', role: 'GenAI Data Engineer',
    period: 'May 2023 — April 2025', category: 'Conversational AI / experimentation',
    teaser: 'An interview simulator shaped by real user behavior.',
    summary: 'I worked on an LLM-powered interview experience that moved from an early idea to more than 300 active users.',
    paragraphs: [
      'I built conversational flows with LangChain and open-source transformer models, then designed a retrieval system that selected and ranked questions for each candidate profile.',
      'Static question delivery only goes so far. Profile-aware retrieval increased average session duration by 25% in our testing. I used A/B experiments across more than 5,000 sessions to compare prompts, retrieval strategies, and response ranking.',
      'This work taught me to treat model behavior as a product question: measure what people do, inspect where an answer fails, and improve the entire interaction rather than just the prompt.',
    ],
    metric: '300+', metricLabel: 'active users',
    tags: ['LangChain', 'RAG', 'Transformers', 'A/B testing'],
  },
  {
    slug: 'abb', title: 'ABB', role: 'Data Analytics Engineer',
    period: 'July 2021 — July 2023', category: 'Industrial data / machine learning',
    teaser: 'Industrial sensor data made useful for maintenance.',
    summary: 'At ABB, I worked with large streams of industrial equipment data to support predictive maintenance.',
    paragraphs: [
      'I designed Azure batch pipelines with Spark and Data Factory to ingest more than 50 million IoT sensor records per day. That foundation supported feature engineering, model training, scheduled retraining, and equipment health scoring.',
      'A Random Forest forecasting approach reduced anomaly-detection false positives by 75% on held-out production windows. I also helped put testing and versioned model releases into the workflow with GitHub Actions and Azure DevOps.',
      'It was where I learned that a good model is only one part of the system. Reliable ingestion, monitoring, and repeatable deployment are what make an analytical idea usable.',
    ],
    metric: '50M+', metricLabel: 'sensor records ingested daily',
    tags: ['Azure', 'Spark', 'Data Factory', 'ML pipelines'],
  },
];

export const projects = [
  {
    slug: 'skyloom', title: 'Skyloom', category: 'Generative systems / data product',
    teaser: 'Weather becomes a new city portrait every day.',
    summary: 'An autonomous daily system that turns live weather and city context into evolving generative art.',
    paragraphs: [
      'Skyloom selects an unused city, reads its current and hourly weather, and retrieves a sourced briefing, landmark, notable person, and local fact. An open-weight model proposes the creative direction, then deterministic code breeds and measures four visual candidates before publishing the strongest one.',
      'The artwork is data-driven rather than decorative. Temperature, cloud cover, precipitation, wind, daylight, and local context shape its palette, motion, density, light, and marks. Each result can be reconstructed in the browser from a compact JSON recipe instead of storing a rendered image.',
      'I designed the system to run unattended and stay inexpensive. GitHub Actions schedules the daily loop, GitHub Pages hosts the archive, and bounded model calls run through Cloudflare Workers AI. Weather and inference failures fall back to deterministic local behavior, while idempotent runs prevent duplicate cities and unnecessary API calls.',
    ],
    metric: '64K+', metricLabel: 'cities in the deterministic catalog',
    tags: ['Python', 'GitHub Actions', 'Workers AI', 'Generative art', 'Open-Meteo', 'Deterministic systems'],
    external: { label: 'View today’s portrait', href: 'https://kp-prajwal.github.io/skyloom/' },
    source: { label: 'Explore the code', href: 'https://github.com/kp-prajwal/skyloom' },
  },
  {
    slug: 'cometverse', title: 'CometVerse', category: 'Conversational AI',
    teaser: 'A voice-enabled campus assistant for UT Dallas.',
    summary: 'A campus assistant built to make university information easier to find through conversation.',
    paragraphs: [
      'I built a chatbot for UT Dallas student questions, combining language models with retrieval over university information. It supports voice input, conversation history, and source links so people can follow up on an answer.',
      'The project explores a simple question: can a conversational interface make scattered campus information easier to use without hiding where the answer came from?',
    ],
    tags: ['LLMs', 'Retrieval', 'Flask', 'Voice'],
    external: { label: 'Explore the code', href: 'https://github.com/kp-prajwal/cometverse' },
  },
  {
    slug: 'pm-interview-assistant', title: 'PM Interview Assistant', category: 'AI product',
    teaser: 'Practice product interviews with responsive questions.',
    summary: 'An interview practice tool that adapts prompts and follow-ups to the conversation.',
    paragraphs: [
      'The assistant lets candidates choose a difficulty and question type, answer by voice, and receive follow-up questions. It combines speech recognition with language-model responses to simulate a more active interview session.',
      'I wanted practice to feel less like reading a static question bank and more like explaining an idea to another person.',
    ],
    tags: ['Python', 'LangChain', 'Speech', 'LLMs'],
    external: { label: 'Explore the code', href: 'https://github.com/kp-prajwal/PMInterviewAssistant' },
  },
  {
    slug: 'streaming-pipeline', title: 'Event Streaming Pipeline', category: 'Data engineering',
    teaser: 'Kafka events flowing into analytics and a dashboard.',
    summary: 'An end-to-end experiment in moving live events from a stream to analysis.',
    paragraphs: [
      'This project uses Kafka to produce and consume events, BigQuery to analyze them with SQL, and Power BI to make the results visible. I built it to explore the boundaries between ingestion, storage, and a useful analytical view.',
    ],
    tags: ['Kafka', 'BigQuery', 'SQL', 'Power BI'],
    external: { label: 'Explore the code', href: 'https://github.com/kp-prajwal/Real-Time-Event-Streaming-Pipeline' },
  },
  {
    slug: 'amazon-etl', title: 'Bookstore ETL', category: 'Data engineering',
    teaser: 'An Airflow pipeline for structured book data.',
    summary: 'A scheduled ETL workflow that turns bookstore listings into analyzable data.',
    paragraphs: [
      'The pipeline extracts book listings, normalizes fields such as title, price, rating, and availability, and loads them into PostgreSQL for downstream analysis. Apache Airflow coordinates the stages and makes the workflow repeatable.',
    ],
    tags: ['Airflow', 'Python', 'PostgreSQL', 'ETL'],
  },
  {
    slug: 'demand-prediction', title: 'Ride Demand Prediction', category: 'Machine learning',
    teaser: 'Exploring Uber and Lyft demand in Boston.',
    summary: 'A comparison of machine-learning approaches for forecasting ride-hailing demand.',
    paragraphs: [
      'I explored trip data with regression, decision trees, random forests, and support-vector methods to understand which features could help anticipate demand. The goal was to connect model performance to practical decisions about driver allocation and pricing.',
    ],
    tags: ['Python', 'Regression', 'Random Forest', 'EDA'],
    external: { label: 'Explore the code', href: 'https://github.com/kp-prajwal/Advanced-Analytics-Demand-Prediction' },
  },
  {
    slug: 'nfl-injuries', title: 'NFL Injury Prediction', category: 'Machine learning',
    teaser: 'Looking for injury signals in game conditions.',
    summary: 'A sports analytics project studying injury risk from play and game features.',
    paragraphs: [
      'I compared logistic regression, decision forests, and survival-analysis approaches, including Cox proportional hazards. Feature importance helped explain which variables carried the strongest signal.',
    ],
    tags: ['Python', 'Classification', 'Survival analysis'],
    external: { label: 'Explore the code', href: 'https://github.com/kp-prajwal/nfl-injury-prediction' },
  },
];

export const about = {
  title: 'About', category: 'A little more context',
  summary: 'I’m Prajwal, a data engineer in Dallas. I grew up in Bengaluru and studied business analytics and AI at UT Dallas.',
  paragraphs: [
    'I like the point where infrastructure becomes useful to someone else: a finance team finding the right number, a student getting a sourced answer, or an engineer trusting a pipeline to run again tomorrow.',
    'My work spans data platforms, applied machine learning, and conversational AI. Outside of work, I’m getting back into cycling, following Manchester United, and finding ways to combine football and data.',
  ],
  tags: ['UT Dallas · MS Business Analytics & AI', 'PES University · BTech Electrical & Electronics'],
};

export const certifications = [
  { label: 'Snowflake SnowPro Associate: Platform', href: 'https://achieve.snowflake.com/699fb3a0-674b-43bf-969c-4a63cd8610d7#acc.QDrWYLZI' },
  { label: 'Microsoft Certified: Azure Data Fundamentals', href: 'https://www.credly.com/badges/acb14565-c906-4fd0-ba79-988f9520fd69/public_url' },
  { label: 'Microsoft Certified: Azure AI Fundamentals', href: 'https://www.credly.com/badges/02e1bee4-3c1d-42d2-8b6f-3a3208d243df/public_url' },
];
