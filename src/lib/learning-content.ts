
export type SubLesson = {
    id: string;
    title: string;
    content: string;
};

export type Lesson = {
    id: string;
    title: string;
    content?: string;
    subLessons?: SubLesson[];
};

export type Stage = {
    stage: string;
    icon: string;
    description: string;
    lessons: Lesson[];
};

export const translations = {
  en: {
    pageTitle: "Aura Learning Path",
    pageDescription: "A complete curriculum to take you from novice to a disciplined trader. Follow the stages in order.",
    finalExamCard: {
        title: "Final Exam: Test Your Knowledge",
        description: "After completing all the lessons, take the final exam to assess your understanding and identify your trading level.",
        buttonText: "Complete All Lessons to Unlock",
        buttonTextActive: "Start Final Exam",
        dialogTitle: "Final Exam Conditions",
        dialogDescription: "You are about to start the final exam. This is a timed test with 10 questions. You must answer all questions to see your result. Are you ready to proceed?",
        dialogAction: "Proceed to Exam",
        dialogCancel: "Cancel",
    },
    markAsRead: "Mark as read",
    lessonLocked: "Complete previous lesson to unlock",
    stages: [
      {
        stage: "Stage 1: Beginner's Foundation",
        icon: 'Star',
        description: "Start your journey here. These lessons cover the absolute essentials of Forex trading.",
        lessons: [
          {
            id: "lesson-1",
            title: "Lesson 1: Introduction to the Forex Market",
            subLessons: [
                { id: "1-1", title: "Q1: What is the Forex Market?", content: "The Foreign Exchange (Forex) market is a global, decentralized market where currencies are traded. It's the largest and most liquid financial market in the world, where participants buy, sell, and exchange currencies at determined prices." },
                { id: "1-2", title: "Q2: How does Forex trading work?", content: "Forex is traded in currency pairs (e.g., EUR/USD). When you trade, you speculate on the value of one currency rising or falling against another. You are always simultaneously buying one currency and selling the other." },
                { id: "1-3", title: "Q3: What are the main sessions in the Forex market?", content: "The market operates 24 hours a day, five days a week, across four main trading sessions: Sydney, Tokyo, London, and New York. The overlap of these sessions, especially London and New York, often sees the highest trading volume." },
                { id: "1-4", title: "Q4: Who are the main participants in the Forex market?", content: "Major participants include central banks, large commercial and investment banks (the interbank market), hedge funds, corporations, and retail traders (individual investors)." },
                { id: "1-5", title: "Q5: What are 'Major' currency pairs?", content: "Major pairs are the most traded pairs in the world. They all involve the US Dollar (USD) and are known for their high liquidity. Examples include EUR/USD, GBP/USD, and USD/JPY." },
                { id: "1-6", title: "Q6: What are 'Minor' or 'Cross' currency pairs?", content: "Minor pairs, or cross-currency pairs, are pairs that do not involve the US Dollar. They consist of other major currencies, like EUR/GBP, EUR/JPY, or GBP/AUD." },
                { id: "1-7", title: "Q7: What are 'Exotic' currency pairs?", content: "Exotic pairs consist of one major currency paired with the currency of an emerging economy. Examples include USD/TRY (US Dollar/Turkish Lira) or EUR/MXN (Euro/Mexican Peso). They are less liquid and have wider spreads." },
                { id: "1-8", title: "Q8: What does it mean for a market to be 'decentralized'?", content: "A decentralized market, like Forex, has no central physical location or exchange. Trading is conducted electronically over-the-counter (OTC), meaning all transactions occur via computer networks between traders worldwide." },
                { id: "1-9", title: "Q9: How do you read a Forex quote like EUR/USD = 1.0850?", content: "The first currency (EUR) is the 'base' currency, and the second (USD) is the 'quote' currency. The quote means 1 Euro is worth 1.0850 US Dollars. The base currency always has a value of 1." },
                { id: "1-10", title: "Q10: What is the difference between buying and selling a pair?", content: "If you 'buy' EUR/USD, you are buying Euros and selling US Dollars, speculating the Euro will strengthen. If you 'sell' EUR/USD, you are selling Euros and buying US Dollars, speculating the Euro will weaken." },
                { id: "1-11", title: "Q11: What drives the Forex market?", content: "The market is driven by a combination of factors, including interest rates, inflation, political stability, economic performance, and speculation. These factors influence the supply and demand for currencies." },
                { id: "1-12", title: "Q12: What is 'liquidity' in Forex?", content: "Liquidity refers to the ability to buy or sell a currency pair without causing a significant change in its exchange rate. The Forex market is extremely liquid, meaning large orders can be filled easily and spreads are often tight, especially for major pairs." },
                { id: "1-13", title: "Q13: Is the Forex market regulated?", content: "While the market is decentralized, regulatory bodies in different countries oversee Forex brokers to ensure fair and ethical behavior. Examples include the FCA in the UK and ASIC in Australia." },
                { id: "1-14", title: "Q14: What is a 'broker' in Forex?", content: "A Forex broker is a financial services company that provides traders with access to a platform for buying and selling foreign currencies. Retail traders need a broker to participate in the market." },
                { id: "1-15", title: "Q15: What are the advantages of trading Forex?", content: "Advantages include high liquidity, 24-hour market access, the ability to trade with leverage, and the potential to profit from both rising and falling markets." },
                { id: "1-16", title: "Q16: What are the risks of trading Forex?", content: "The main risks include the potential for significant losses due to leverage, market volatility, and the complex nature of global economic factors. Risk management is crucial." },
                { id: "1-17", title: "Q17: What is the 'Interbank Market'?", content: "The interbank market is the global network used by financial institutions to trade currencies with each other. They trade directly, and this market sets the prices that are then offered to retail traders." },
                { id: "1-18", title: "Q18: What is a 'currency pair'?", content: "A currency pair is the quotation of two different currencies, with the value of one currency being quoted against the other. For example, in GBP/USD, the value of the British Pound is quoted against the US Dollar." },
                { id: "1-19", title: "Q19: Why is the US Dollar so important in Forex?", content: "The USD is the world's primary reserve currency. It is involved in the majority of global trade and is on one side of most Forex transactions, making it the most traded currency." },
                { id: "1-20", title: "Q20: Can you trade Forex on weekends?", content: "No, the retail Forex market is closed on weekends. It closes Friday evening (New York time) and reopens Sunday evening (Sydney time). Prices can 'gap' over the weekend if significant news occurs." }
            ]
          },
          {
            id: "lesson-2",
            title: "Lesson 2: Key Terminology",
             subLessons: [
                { id: "2-1", title: "Q1: What is a 'Pip'?", content: "A 'Pip' (Percentage in Point) is a standardized unit and is the smallest amount by which a currency quote can change. For most currency pairs, one pip is a change in the 4th decimal place (e.g., 0.0001)." },
                { id: "2-2", title: "Q2: What is a 'Pipette'?", content: "A 'Pipette' represents a fraction of a pip. It is the 5th decimal place in most currency quotes (e.g., 0.00001). It allows for more precise pricing." },
                { id: "2-3", title: "Q3: What is the 'Bid' price?", content: "The 'Bid' price is the price at which a broker is willing to buy the base currency from you. It's the price at which you, the trader, can 'sell' the pair." },
                { id: "2-4", title: "Q4: What is the 'Ask' price?", content: "The 'Ask' price is the price at which a broker is willing to sell the base currency to you. It's the price at which you, the trader, can 'buy' the pair. The ask price is always slightly higher than the bid price." },
                { id: "2-5", title: "Q5: What is the 'Spread'?", content: "The spread is the difference between the ask price and the bid price. This is the primary way Forex brokers make money. A smaller spread is more favorable for the trader." },
                { id: "2-6", title: "Q6: What is 'Leverage'?", content: "Leverage is a tool provided by brokers that allows traders to control a large position in the market with a relatively small amount of their own capital. For example, 100:1 leverage means you can control a $100,000 position with just $1,000." },
                { id: "2-7", title: "Q7: What is 'Margin'?", content: "Margin is the amount of money required in your account to open and maintain a leveraged position. It's not a fee, but a portion of your account equity set aside as a deposit. For example, with 100:1 leverage, the margin for a $100,000 position is $1,000." },
                { id: "2-8", title: "Q8: What is a 'Margin Call'?", content: "A margin call occurs when your account equity falls below the required margin level to maintain your open positions. The broker will ask you to deposit more funds or will close some/all of your positions to cover your losses." },
                { id: "2-9", title: "Q9: What is a 'Lot'?", content: "A lot is a unit of measurement for a transaction size. A 'Standard Lot' is 100,000 units of the base currency. This is the standard size of a trading contract." },
                { id: "2-10", title: "Q10: What are 'Mini' and 'Micro' Lots?", content: "A 'Mini Lot' is 10,000 units of the base currency (0.1 of a standard lot). A 'Micro Lot' is 1,000 units (0.01 of a standard lot). These smaller lot sizes allow traders with less capital to participate in the market and manage risk." },
                { id: "2-11", title: "Q11: What does 'Long' and 'Short' mean?", content: "Going 'long' means you are buying a currency pair, expecting its value to rise. Going 'short' means you are selling a currency pair, expecting its value to fall." },
                { id: "2-12", title: "Q12: What is 'Slippage'?", content: "Slippage occurs when a trade is executed at a different price than the requested price. This usually happens during periods of high volatility or when a large order is executed." },
                { id: "2-13", title: "Q13: What is 'Bullish' vs 'Bearish'?", content: "A 'Bullish' market is one where prices are trending upwards. A 'Bearish' market is one where prices are trending downwards. A bull market signifies optimism, while a bear market signifies pessimism." },
                { id: "2-14", title: "Q14: What is 'Volatility'?", content: "Volatility is a measure of the frequency and magnitude of price changes. A highly volatile market sees large price swings, offering more profit potential but also greater risk." },
                { id: "2-15", title: "Q15: What is a 'Take Profit' (TP) order?", content: "A Take Profit is an order you place to automatically close a profitable trade once it reaches a certain price level. It's used to lock in profits." },
                { id: "2-16", title: "Q16: What is a 'Stop-Loss' (SL) order?", content: "A Stop-Loss is an order you place to automatically close a losing trade once it reaches a certain price level. It is a crucial risk management tool to limit potential losses." },
                { id: "2-17", title: "Q17: What is a 'Base' currency?", content: "The base currency is the first currency in a currency pair (e.g., the EUR in EUR/USD). The exchange rate shows how much of the quote currency is needed to buy one unit of the base currency." },
                { id: "2-18", title: "Q18: What is a 'Quote' currency?", content: "The quote currency is the second currency in a currency pair (e.g., the USD in EUR/USD). It is the currency in which the base currency is valued." },
                { id: "2-19", title: "Q19: What is 'Rollover' or 'Swap'?", content: "Rollover (or Swap) is the interest paid or earned for holding a position overnight. It's based on the interest rate differential between the two currencies in a pair." },
                { id: "2-20", title: "Q20: What is 'Hedging'?", content: "Hedging is a strategy used to protect a position from an adverse move. In Forex, it might involve opening a second position in the opposite direction of your initial trade to limit losses." }
            ]
          },
          {
            id: "lesson-3",
            title: "Lesson 3: Types of Orders",
            subLessons: [
                { id: "3-1", title: "Q1: What is a Market Order?", content: "A Market Order is an instruction to a broker to execute a trade immediately at the best available price. It is the quickest way to enter or exit the market." },
                { id: "3-2", title: "Q2: When should you use a Market Order?", content: "Use a Market Order when your primary goal is to get into a trade quickly, and you are less concerned about the exact entry price. It's common in fast-moving markets." },
                { id: "3-3", title: "Q3: What is a Limit Order?", content: "A Limit Order is an instruction to execute a trade at a specific price or better. This gives you control over your entry or exit price." },
                { id: "3-4", title: "Q4: What is a 'Buy Limit' order?", content: "A Buy Limit order is placed below the current market price. The trade is only executed if the market price drops to your specified limit price or lower." },
                { id: "3-5", title: "Q5: What is a 'Sell Limit' order?", content: "A Sell Limit order is placed above the current market price. The trade is only executed if the market price rises to your specified limit price or higher." },
                { id: "3-6", title: "Q6: What is a Stop Order (or Stop-Entry Order)?", content: "A Stop Order is an instruction to buy or sell a currency pair once it reaches a certain price. It's often used for trading breakouts." },
                { id: "3-7", title: "Q7: What is a 'Buy Stop' order?", content: "A Buy Stop order is placed above the current market price. It is executed only when the market price rises to that level. Traders use it to buy into a breakout above a resistance level." },
                { id: "3-8", title: "Q8: What is a 'Sell Stop' order?", content: "A Sell Stop order is placed below the current market price. It is executed only when the market price falls to that level. Traders use it to sell into a breakout below a support level." },
                { id: "3-9", title: "Q9: What is the difference between a Limit Order and a Stop Order?", content: "A Limit Order is used to enter the market at a more favorable price (buy low, sell high). A Stop Order is used to enter the market when it gains momentum in a certain direction (buy high, sell low)." },
                { id: "3-10", title: "Q10: What is a Stop-Loss Order?", content: "A Stop-Loss (SL) is a defensive order linked to your open trade. It automatically closes your position if the market moves against you by a specified amount, thereby limiting your potential loss." },
                { id: "3-11", title: "Q11: Why is a Stop-Loss order essential?", content: "It is the most important risk management tool. It protects your capital from significant losses and removes the emotion from the decision to exit a losing trade." },
                { id: "3-12", title: "Q12: What is a Take-Profit Order?", content: "A Take-Profit (TP) is an order linked to your open trade. It automatically closes your position when it reaches a specified level of profit, ensuring you secure your gains." },
                { id: "3-13", title: "Q13: What is a 'Trailing Stop' order?", content: "A Trailing Stop is a type of stop-loss order that moves with the price of a profitable trade. It is set at a certain percentage or pip amount below (for a long trade) or above (for a short trade) the market price, locking in profits as the trade moves in your favor." },
                { id: "3-14", title: "Q14: What is a Good 'Til Canceled (GTC) order?", content: "A GTC order remains active in the market until you decide to cancel it. Most pending orders (Limit, Stop) are GTC by default." },
                { id: "3-15", title: "Q15: What is a Good for the Day (GFD) order?", content: "A GFD order remains active until the end of the trading day. If it is not executed by the close of the market, it is automatically canceled." },
                { id: "3-16", title: "Q16: What is an Order-Cancels-Order (OCO) order?", content: "An OCO order combines two pending orders (usually a Limit and a Stop). If one of the orders is executed, the other is automatically canceled. This is useful for trading ranges or breakouts." },
                { id: "3-17", title: "Q17: How does a broker execute orders?", content: "Brokers can be 'Dealing Desk' (Market Makers) who take the other side of your trade, or 'No Dealing Desk' (ECN/STP) who pass your orders directly to the interbank market." },
                { id: "3-18", title: "Q18: What is 'entry price'?", content: "The entry price is the price at which your trade is executed, and your position is officially opened in the market." },
                { id: "3-19", title: "Q19: Can pending orders be modified?", content: "Yes, you can almost always modify or cancel a pending order (like a Buy Limit or a Sell Stop) at any time before it has been executed." },
                { id: "3-20", title: "Q20: What is a 'fill'?", content: "A 'fill' is the execution of an order. A 'partial fill' is when only part of your order is executed at a certain price." }
            ]
          },
          {
            id: "lesson-4",
            title: "Lesson 4: Types of Analysis",
            subLessons: [
                { id: "4-1", title: "Q1: What are the three main types of market analysis?", content: "The three main types are Technical Analysis, Fundamental Analysis, and Sentimental Analysis." },
                { id: "4-2", title: "Q2: What is Technical Analysis?", content: "Technical Analysis involves forecasting future price movements by examining past market data, primarily price and volume. It uses charts and indicators to identify patterns and trends." },
                { id: "4-3", title: "Q3: What is the core assumption of Technical Analysis?", content: "The core assumption is that all known information is already reflected in the price. Therefore, studying price action is all that is needed to make trading decisions. History tends to repeat itself." },
                { id: "4-4", title: "Q4: What tools are used in Technical Analysis?", content: "Tools include chart patterns (e.g., head and shoulders), trend lines, support & resistance levels, and technical indicators (e.g., Moving Averages, RSI, MACD)." },
                { id: "4-5", title: "Q5: What is Fundamental Analysis?", content: "Fundamental Analysis involves evaluating a currency's intrinsic value by examining related economic and financial factors. The goal is to determine if a currency is overvalued or undervalued." },
                { id: "4-6", title: "Q6: What factors are considered in Fundamental Analysis?", content: "Key factors include interest rates set by central banks, GDP growth, inflation rates (CPI), employment data (like NFP), and political stability." },
                { id: "4-7", title: "Q7: How do interest rates affect a currency?", content: "Higher interest rates generally make a currency more attractive to foreign investors, increasing demand and causing the currency's value to rise. Conversely, lower interest rates can weaken a currency." },
                { id: "4-8", title: "Q8: What is Sentimental Analysis?", content: "Sentimental Analysis involves gauging the overall mood or feeling of market participants (the 'crowd') towards a particular currency pair. It asks: 'Is the market generally bullish or bearish?'" },
                { id: "4-9", title: "Q9: How can you measure market sentiment?", content: "Sentiment can be measured through tools like the Commitment of Traders (COT) report, which shows the positions of large traders, and by observing news headlines and market positioning data from brokers." },
                { id: "4-10", title: "Q10: Should you use only one type of analysis?", content: "No. Most successful traders use a combination of analysis types. For example, they might use fundamental analysis to determine the long-term trend and technical analysis to find precise entry and exit points." },
                { id: "4-11", title: "Q11: What is a 'top-down' approach to analysis?", content: "This involves starting with a broad, macroeconomic view (fundamental analysis) to identify strong vs. weak economies, and then drilling down to specific currency pairs and using technical analysis to time trades." },
                { id: "4-12", title: "Q12: What is a 'bottom-up' approach?", content: "This approach focuses primarily on an individual chart pattern or signal (technical analysis) and then considers fundamental factors as a secondary confirmation." },
                { id: "4-13", title: "Q13: What is 'Price Action' trading?", content: "Price action trading is a form of technical analysis that focuses purely on reading the candlestick chart itself, without relying heavily on lagging indicators. It's about understanding the story that price is telling." },
                { id: "4-14", title: "Q14: What is 'Quantitative Analysis'?", content: "This is a highly mathematical and statistical approach to analyzing market data. It is often used by large hedge funds and financial institutions to build complex trading algorithms." },
                { id: "4-15", title: "Q15: How can news events impact technical patterns?", content: "A major news release (e.g., an interest rate decision) can completely invalidate a technical pattern. This is why many technical traders avoid holding positions during major news events." },
                { id: "4-16", title: "Q16: Which timeframe is best for fundamental analysis?", content: "Fundamental factors tend to play out over longer periods. Therefore, fundamental analysis is most useful for long-term traders (swing or position traders) who hold trades for days, weeks, or months." },
                { id: "4-17", title: "Q17: Which timeframe is best for technical analysis?", content: "Technical analysis can be applied to any timeframe, from 1-minute charts (for scalpers) to weekly charts (for position traders). The principles remain the same." },
                { id: "4-18", title: "Q18: What is a 'leading' indicator?", content: "A leading indicator is designed to precede future price movements. Examples include RSI and Stochastic Oscillator, which can signal overbought/oversold conditions before a price reversal." },
                { id: "4-19", title: "Q19: What is a 'lagging' indicator?", content: "A lagging indicator follows the price action and confirms what has already happened. Moving Averages are a classic example. They are useful for confirming trend direction." },
                { id: "4-20", title: "Q20: How do the three analysis types work together?", content: "1. Fundamentals tell you WHY a market might move. 2. Technicals tell you WHEN it might move. 3. Sentiment tells you HOW FAR it might move based on current market positioning." }
            ]
          }
        ]
      },
      {
        stage: "Stage 2: Intermediate Strategies",
        icon: 'Target',
        description: "Build on your knowledge with technical patterns, indicators, and risk management.",
        lessons: [
          { 
            id: "s2-l1", 
            title: "Lesson 1: Introduction to Chart Types", 
            subLessons: [
                {id: "s2-l1-1", title: "Q1: What are the three main chart types in trading?", content: "The three main chart types are Line charts, Bar charts, and Candlestick charts."},
                {id: "s2-l1-2", title: "Q2: How does a Line chart work?", content: "A Line chart is the simplest type. It connects a series of closing prices over a specific period, forming a single, continuous line. It's useful for seeing the overall trend but lacks detail."},
                {id: "s2-l1-3", title: "Q3: What information does a Line chart provide?", content: "It only provides the closing price for each period. You cannot see the open, high, or low prices for that period."},
                {id: "s2-l1-4", title: "Q4: What is a Bar chart (OHLC chart)?", content: "A Bar chart provides more information than a line chart. Each bar represents a single period and shows four key prices: the Open, High, Low, and Close (OHLC)."},
                {id: "s2-l1-5", title: "Q5: How do you read a bar on a Bar chart?", content: "The vertical line shows the range between the high and low price. A small horizontal tick on the left shows the opening price, and a small horizontal tick on the right shows the closing price."},
                {id: "s2-l1-6", title: "Q6: What is a Candlestick chart?", content: "A Candlestick chart is the most popular type. Like a bar chart, it shows the Open, High, Low, and Close prices, but it does so in a more visual way that is easier to read."},
                {id: "s2-l1-7", title: "Q7: What are the components of a candlestick?", content: "A candlestick has two main parts: the 'body' (the wide part) and the 'wicks' or 'shadows' (the thin lines extending from the body)."},
                {id: "s2-l1-8", title: "Q8: What does the 'body' of a candlestick represent?", content: "The body represents the range between the opening and closing price for that period. Its color indicates the direction of price movement."},
                {id: "s2-l1-9", title: "Q9: What does a green (or white/blue) candlestick body mean?", content: "A green (or bullish) candlestick means the closing price was higher than the opening price. The price went up during that period."},
                {id: "s2-l1-10", title: "Q10: What does a red (or black) candlestick body mean?", content: "A red (or bearish) candlestick means the closing price was lower than the opening price. The price went down during that period."},
                {id: "s2-l1-11", title: "Q11: What do the 'wicks' (or shadows) of a candlestick show?", content: "The wicks show the highest and lowest prices reached during the period. The top of the upper wick is the high, and the bottom of the lower wick is the low."},
                {id: "s2-l1-12", title: "Q12: Why are Candlestick charts so popular?", content: "They are popular because they make it easy to see the relationship between the open and close, as well as the high and low. The colors and patterns formed by candlesticks can reveal market psychology."},
                {id: "s2-l1-13", title: "Q13: What information do you lose with a Line chart?", content: "With a line chart, you lose all information about the price volatility within a period. You don't know the open, high, or low, only where the period ended."},
                {id: "s2-l1-14", title: "Q14: What is a 'timeframe' in charting?", content: "A timeframe is the duration that each bar or candlestick represents. Common timeframes include 1 minute (M1), 1 hour (H1), 4 hours (H4), daily (D1), and weekly (W1)."},
                {id: "s2-l1-15", title: "Q15: How does changing the timeframe affect the chart?", content: "A smaller timeframe (like M5) shows more detail and noise in price movements. A larger timeframe (like D1) filters out the noise and shows the more significant, long-term trend."},
                {id: "s2-l1-16", title: "Q16: Which chart type is best for identifying patterns?", content: "Candlestick charts are by far the best for identifying price patterns. The visual nature of the candles makes patterns like 'engulfing' or 'doji' much easier to spot."},
                {id: "s2-l1-17", title: "Q17: What does a long upper wick on a candlestick suggest?", content: "A long upper wick suggests that buyers tried to push the price up significantly, but sellers came in and pushed it back down before the period closed. It can be a sign of selling pressure."},
                {id: "s2-l1-18", title: "Q18: What does a long lower wick on a candlestick suggest?", content: "A long lower wick suggests that sellers tried to push the price down, but buyers stepped in and pushed it back up before the close. It can be a sign of buying pressure."},
                {id: "s2-l1-19", title: "Q19: Can you use different chart types together?", content: "Yes. Some traders might use a line chart on a higher timeframe to see the clean, long-term trend, and then switch to a candlestick chart on a lower timeframe to find precise entry points."},
                {id: "s2-l1-20", title: "Q20: For a beginner, which chart type is recommended to start with?", content: "Candlestick charts are highly recommended. While they have a slight learning curve, the amount of information and clarity they provide is essential for learning modern technical analysis."}
            ]
          },
          { 
            id: "s2-l2", 
            title: "Lesson 2: Deep Dive into Japanese Candlesticks", 
            subLessons: [
                { id: "s2-l2-1", title: "Q1: What is the core principle of single candlestick analysis?", content: "The core principle is that the shape of a single candle can reveal the psychology of the market (the battle between buyers and sellers) during that specific period, often signaling potential reversals or indecision." },
                { id: "s2-l2-2", title: "Q2: What is a 'Doji' candlestick?", content: "A Doji is a candle with a very small or non-existent body, meaning the open and close prices are nearly identical. It signals indecision and a potential turning point in the market." },
                { id: "s2-l2-3", title: "Q3: What are the main types of Doji?", content: "The main types are the Neutral Doji (cross shape), Long-Legged Doji (long upper and lower wicks), Dragonfly Doji (long lower wick, no upper wick), and Gravestone Doji (long upper wick, no lower wick)." },
                { id: "s2-l2-4", title: "Q4: What does a 'Dragonfly Doji' at the bottom of a downtrend suggest?", content: "It's a strong bullish reversal signal. It shows that sellers pushed the price down, but buyers took complete control by the end of the period, pushing the price back up to the open." },
                { id: "s2-l2-5", title: "Q5: What does a 'Gravestone Doji' at the top of an uptrend suggest?", content: "It's a strong bearish reversal signal. It shows that buyers pushed the price up, but sellers overwhelmed them, pushing the price back down to the open." },
                { id: "s2-l2-6", title: "Q6: What is a 'Spinning Top' candlestick?", content: "A Spinning Top has a small body with long upper and lower wicks of similar size. Like a Doji, it signifies indecision in the market, as neither buyers nor sellers could gain control." },
                { id: "s2-l2-7", title: "Q7: What is a 'Hammer' candlestick?", content: "A Hammer is a bullish reversal pattern found at the bottom of a downtrend. It has a small body at the top, a long lower wick (at least twice the body size), and little to no upper wick." },
                { id: "s2-l2-8", title: "Q8: What is the psychology behind a Hammer?", content: "It shows that sellers were initially in control, pushing the price far down. However, strong buying pressure emerged, and the price rallied to close near its opening, signaling a potential bottom." },
                { id: "s2-l2-9", title: "Q9: What is a 'Hanging Man' candlestick?", content: "A Hanging Man looks identical to a Hammer but appears at the top of an uptrend. It's a bearish reversal signal, suggesting that selling pressure is starting to appear." },
                { id: "s2-l2-10", title: "Q10: Why is a Hanging Man bearish if it looks like a bullish Hammer?", content: "Context is key. At the top of an uptrend, the long lower wick shows that a significant sell-off occurred during the period, even though buyers managed to push it back up. It's a warning that sellers are testing the market." },
                { id: "s2-l2-11", title: "Q11: What is an 'Inverted Hammer'?", content: "An Inverted Hammer is a bullish reversal pattern found at the bottom of a downtrend. It looks like an upside-down Hammer: small body at the bottom, long upper wick, and little to no lower wick." },
                { id: "s2-l2-12", title: "Q12: What is the psychology of an Inverted Hammer?", content: "It shows that buyers tried to rally the price, but sellers pushed it back down. However, the fact that buyers showed this strength after a downtrend is a potential sign that sellers are losing momentum." },
                { id: "s2-l2-13", title: "Q13: What is a 'Shooting Star'?", content: "A Shooting Star looks identical to an Inverted Hammer but appears at the top of an uptrend. It is a strong bearish reversal pattern." },
                { id: "s2-l2-14", title: "Q14: What is the psychology behind a Shooting Star?", content: "At the peak of an uptrend, buyers push the price higher, but sellers step in with overwhelming force, pushing the price all the way back down to close near the open. This signals that the uptrend may be over." },
                { id: "s2-l2-15", title: "Q15: What is a 'Marubozu' candle?", content: "A Marubozu is a candle with a full body and no wicks at all. A green Marubozu is extremely bullish (buyers were in control from open to close). A red Marubozu is extremely bearish (sellers were in control)." },
                { id: "s2-l2-16", title: "Q16: Does the color of a Hammer's body matter?", content: "A green Hammer (where the close is above the open) is considered slightly more bullish than a red Hammer, but both are valid reversal signals. The shape is more important than the color." },
                { id: "s2-l2-17", title: "Q17: Does the color of a Shooting Star's body matter?", content: "A red Shooting Star (where the close is below the open) is considered slightly more bearish than a green one, but again, both are valid bearish signals. The long upper wick is the key feature." },
                { id: "s2-l2-18", title: "Q18: What is 'confirmation' in candlestick trading?", content: "Confirmation is when the next candle after a pattern signal moves in the expected direction. For example, after a Hammer, a confirmation would be the next candle closing higher." },
                { id: "s2-l2-19", title: "Q19: Are single candlestick patterns reliable on their own?", content: "They are more reliable when they appear at a significant technical level, such as a major support/resistance zone, a trend line, or a key moving average. Context is everything." },
                { id: "s2-l2-20", title: "Q20: What is the main difference between a Doji and a Spinning Top?", content: "Both signal indecision. The main visual difference is that a Doji has a line for a body (open and close are almost identical), while a Spinning Top has a short, but visible, rectangular body." }
            ]
          },
          { 
            id: "s2-l3", 
            title: "Lesson 3: Dual Candlestick Patterns", 
            subLessons: [
              { id: "s2-l3-1", title: "Q1: What is a dual candlestick pattern?", content: "A dual candlestick pattern is a signal formed by two consecutive candles that, when read together, provide a stronger indication of a potential market reversal or continuation than a single candle could." },
              { id: "s2-l3-2", title: "Q2: What is the 'Bullish Engulfing' pattern?", content: "A Bullish Engulfing pattern occurs at the bottom of a downtrend. It consists of a small bearish candle followed by a larger bullish candle whose body completely 'engulfs' the body of the previous candle. It's a strong reversal signal." },
              { id: "s2-l3-3", title: "Q3: What is the psychology behind the Bullish Engulfing pattern?", content: "The first candle shows sellers are in control. The second, larger candle shows that buyers stepped in with overwhelming force, not only erasing the sellers' progress but also closing significantly higher, indicating a powerful shift in momentum." },
              { id: "s2-l3-4", title: "Q4: What is the 'Bearish Engulfing' pattern?", content: "A Bearish Engulfing pattern occurs at the top of an uptrend. It's the opposite of the bullish version: a small bullish candle is followed by a larger bearish candle that completely engulfs the prior candle's body. It's a strong bearish reversal signal." },
              { id: "s2-l3-5", title: "Q5: What is a 'Tweezer Bottom' pattern?", content: "A Tweezer Bottom is a bullish reversal pattern. It consists of two consecutive candles with nearly identical low points. The first candle is bearish, and the second is bullish, showing that the market rejected the lower price level." },
              { id: "s2-l3-6", title: "Q6: What is a 'Tweezer Top' pattern?", content: "A Tweezer Top is a bearish reversal pattern. It consists of two consecutive candles with nearly identical high points. The first candle is bullish, and the second is bearish, indicating the market rejected the higher price level." },
              { id: "s2-l3-7", title: "Q7: What is the 'Piercing Line' pattern?", content: "The Piercing Line is a bullish reversal pattern found after a downtrend. It's a two-candle pattern: the first is a strong bearish candle, and the second is a bullish candle that opens below the low of the first candle but closes more than halfway up the body of the first candle." },
              { id: "s2-l3-8", title: "Q8: What does the Piercing Line pattern signify?", content: "It signifies a potential bottom. The gap down on the second candle's open shows strong selling pressure, but the powerful rally to close well into the previous candle's body shows that buyers have taken significant control." },
              { id: "s2-l3-9", title: "Q9: What is the 'Dark Cloud Cover' pattern?", content: "Dark Cloud Cover is the bearish counterpart to the Piercing Line and occurs after an uptrend. The first candle is a strong bullish candle. The second candle is bearish, opens above the high of the first, but then closes more than halfway down the body of the first candle." },
              { id: "s2-l3-10", title: "Q10: Why are dual patterns generally more reliable than single patterns?", content: "Dual patterns provide more information about the market's behavior over two periods. They can show a more definitive struggle and a clearer shift in power between buyers and sellers, which adds to the pattern's reliability." }
            ]
          },
          { 
            id: "s2-l4", 
            title: "Lesson 4: Triple Candlestick Patterns", 
            subLessons: [
              { id: "s2-l4-1", title: "Q1: What is a triple candlestick pattern?", content: "A triple candlestick pattern is a signal formed by three consecutive candles. These patterns are generally considered to be some of the most reliable candlestick signals because they represent three full sessions of market psychology." },
              { id: "s2-l4-2", title: "Q2: What is the 'Morning Star' pattern?", content: "The Morning Star is a powerful bullish reversal pattern that occurs at the bottom of a downtrend. It consists of three candles: 1) a large bearish candle, 2) a small-bodied candle (like a Doji or spinning top) that gaps down, and 3) a large bullish candle that closes at least halfway up the first candle's body." },
              { id: "s2-l4-3", title: "Q3: What is the psychology of the Morning Star?", content: "It shows a clear transition: sellers are in full control (candle 1), then there is a moment of complete indecision and a potential halt in momentum (candle 2), followed by buyers taking decisive control (candle 3)." },
              { id: "s2-l4-4", title: "Q4: What is the 'Evening Star' pattern?", content: "The Evening Star is the bearish counterpart to the Morning Star and signals a potential top. It appears after an uptrend and consists of: 1) a large bullish candle, 2) a small-bodied candle that gaps up, and 3) a large bearish candle that closes at least halfway down the first candle's body." },
              { id: "s2-l4-5", title: "Q5: What are the 'Three White Soldiers'?", content: "This is a strong bullish reversal or continuation pattern. It consists of three long, consecutive bullish candles, each closing higher than the last. Ideally, each candle opens within the body of the previous one." },
              { id: "s2-l4-6", title: "Q6: What do the Three White Soldiers signify?", content: "They signify a steady and powerful advance by the buyers. The lack of long shadows on the candles indicates that buyers have been in control from open to close for three straight periods." },
              { id: "s2-l4-7", title: "Q7: What are the 'Three Black Crows'?", content: "This is the bearish counterpart to the Three White Soldiers. It consists of three long, consecutive bearish candles, each closing lower than the last. It's a strong bearish reversal or continuation signal." },
              { id: "s2-l4-8", title: "Q8: What is the 'Three Inside Up' pattern?", content: "This is a bullish reversal pattern. It starts with a large bearish candle. The second candle is a small bullish candle contained within the body of the first. The third candle is a bullish candle that closes above the high of the first candle, confirming the reversal." },
              { id: "s2-l4-9", title: "Q9: What is the 'Three Inside Down' pattern?", content: "This is a bearish reversal pattern. It starts with a large bullish candle. The second candle is a small bearish candle contained within the first candle's body. The third candle is a bearish candle that closes below the low of the first candle, confirming the bearish reversal." },
              { id: "s2-l4-10", title: "Q10: Where are triple candlestick patterns most effective?", content: "Like all candlestick patterns, they are most reliable and effective when they form at a significant technical level, such as a major support or resistance zone, a key Fibonacci level, or a long-term trendline." }
            ]
          },
          { 
            id: "s2-l5", 
            title: "Lesson 5: Identifying Support and Resistance", 
            subLessons: [
              { id: "s2-l5-1", title: "Q1: What is a Support level?", content: "A Support level is a price point on a chart where buying interest is historically strong enough to overcome selling pressure. It acts as a 'floor' that stops the price from falling further." },
              { id: "s2-l5-2", title: "Q2: What is a Resistance level?", content: "A Resistance level is a price point where selling pressure is historically strong enough to overcome buying pressure. It acts as a 'ceiling' that stops the price from rising higher." },
              { id: "s2-l5-3", title: "Q3: How do you identify a potential Support level?", content: "Look for previous swing lows or troughs on the chart. A horizontal line can be drawn connecting multiple low points. The more times price has touched and bounced off this level, the stronger it is." },
              { id: "s2-l5-4", title: "Q4: How do you identify a potential Resistance level?", content: "Look for previous swing highs or peaks on the chart. A horizontal line connecting multiple high points indicates a resistance level. The more rejections from this level, the stronger it is." },
              { id: "s2-l5-5", title: "Q5: What is the 'Role Reversal' principle?", content: "This is a key concept where a broken support level can become a new resistance level, and a broken resistance level can become a new support level. This is also known as a 'flip' zone." },
              { id: "s2-l5-6", title: "Q6: Why does Role Reversal happen?", content: "It's based on market psychology. When a support level breaks, buyers who bought at that level are now in a losing position. They may look to sell at their entry price (the old support) if price returns, creating new resistance." },
              { id: "s2-l5-7", title: "Q7: Are support and resistance single price points or zones?", content: "It's best to think of them as zones or areas rather than exact lines. Price may not stop at the exact same price every time, so drawing a small 'box' or 'zone' is often more practical." },
              { id: "s2-l5-8", title: "Q8: How does timeframe affect support and resistance?", content: "Levels identified on higher timeframes (like Daily or Weekly) are far more significant and stronger than levels identified on lower timeframes (like 15-minute or 1-hour)." },
              { id: "s2-l5-9", title: "Q9: What other tools can help identify support and resistance?", content: "Besides horizontal lines, other tools include: trend lines, channels, moving averages (dynamic support/resistance), Fibonacci retracement levels, and pivot points." },
              { id: "s2-l5-10", title: "Q10: What does a 'breakout' of a level mean?", content: "A breakout occurs when the price moves decisively through a support or resistance level and closes beyond it. A breakout above resistance is a bullish signal, while a breakout below support is a bearish signal." }
            ]
          },
          { 
            id: "s2-l6", 
            title: "Lesson 6: Trend Lines and Channels", 
            subLessons: [
              { id: "s2-l6-1", title: "Q1: What is a Trend Line?", content: "A trend line is a straight line drawn on a chart connecting a series of price points to identify the direction and steepness of a trend." },
              { id: "s2-l6-2", title: "Q2: How do you draw an Uptrend Line?", content: "An uptrend line is drawn by connecting at least two significant 'swing lows' (troughs). The line should have a positive slope, and the price action should be above the line." },
              { id: "s2-l6-3", title: "Q3: How do you draw a Downtrend Line?", content: "A downtrend line is drawn by connecting at least two significant 'swing highs' (peaks). The line should have a negative slope, and the price action should be below the line." },
              { id: "s2-l6-4", title: "Q4: How many 'touches' make a trend line valid?", content: "A trend line requires at least two points to be drawn. However, a third touch of the line is what validates it and makes it a significant technical level to watch." },
              { id: "s2-l6-5", title: "Q5: How are trend lines used in trading?", content: "Traders use trend lines as dynamic support (in an uptrend) or dynamic resistance (in a downtrend). They may look to buy when price pulls back to an uptrend line or sell when price rallies to a downtrend line." },
              { id: "s2-l6-6", title: "Q6: What does it mean when a trend line is 'broken'?", content: "A broken trend line occurs when the price closes decisively on the other side of the line. A break of an uptrend line is a potential bearish signal, and a break of a downtrend line is a potential bullish signal." },
              { id: "s2-l6-7", title: "Q7: What is a Price Channel?", content: "A price channel (or trend channel) is created by drawing a second line parallel to an existing trend line. In an uptrend, this parallel line connects the swing highs. In a downtrend, it connects the swing lows." },
              { id: "s2-l6-8", title: "Q8: What does a price channel show?", content: "A channel contains the majority of price action and can help identify overbought (at the top of the channel) and oversold (at the bottom of the channel) conditions within a trend." },
              { id: "s2-l6-9", title: "Q9: Should you adjust a trend line if it gets slightly broken?", content: "Sometimes. If price briefly pierces the line but doesn't close decisively beyond it, some traders will adjust the line to better fit the most recent price action. However, frequent adjustments can negate its purpose." },
              { id: "s2-l6-10", title: "Q10: Is the steepness (angle) of a trend line important?", content: "Yes. A very steep trend line is often unsustainable and likely to be broken sooner. A more moderate angle (around 30-45 degrees) often indicates a healthier, more sustainable trend." }
            ]
          },
          { id: "s2-l7", title: "Lesson 7: Chart Patterns Part 1 - Reversal Patterns", content: "Learn to spot major reversal patterns like Head and Shoulders, Inverse Head and Shoulders, and Double/Triple Tops and Bottoms." },
          { id: "s2-l8", title: "Lesson 8: Chart Patterns Part 2 - Continuation Patterns", content: "Identify patterns that suggest the current trend will continue, such as Triangles (Symmetrical, Ascending, Descending), Flags, and Pennants." },
          { id: "s2-l9", title: "Lesson 9: Introduction to Technical Indicators", content: "Understand the difference between leading and lagging indicators and how they can be used to confirm price action, not predict it." },
          { id: "s2-l10", title: "Lesson 10: Moving Averages (MA)", content: "Learn about Simple Moving Averages (SMA) and Exponential Moving Averages (EMA). Understand how they can be used to identify trend direction and as dynamic support/resistance." },
          { id: "s2-l11", title: "Lesson 11: Moving Average Crossovers", content: "Discover the concept of the 'Golden Cross' (e.g., 50 EMA crossing above 200 EMA) and 'Death Cross' as long-term trend signals." },
          { id: "s2-l12", title: "Lesson 12: Relative Strength Index (RSI)", content: "Learn how to use the RSI to identify overbought (&gt;70) and oversold (&lt;30) conditions. Also, learn about the powerful concept of RSI divergence." },
          { id: "s2-l13", title: "Lesson 13: Moving Average Convergence Divergence (MACD)", content: "Understand the components of the MACD (MACD line, signal line, histogram) and how to use crossovers and the histogram to gauge momentum." },
          { id: "s2-l14", title: "Lesson 14: Bollinger Bands", content: "Learn how the three bands (upper, middle, lower) represent volatility. Understand concepts like 'the squeeze' and how prices react to the outer bands." },
          { id: "s2-l15", title: "Lesson 15: Fibonacci Retracement", content: "Discover how to use the Fibonacci tool to identify potential support and resistance levels after a significant price move. Key levels include 38.2%, 50%, and 61.8%." },
          { id: "s2-l16", title: "Lesson 16: Stochastic Oscillator", content: "Similar to RSI, learn how the Stochastic Oscillator can identify overbought (&gt;80) and oversold (&lt;20) conditions by comparing a closing price to its price range over a period." },
          { id: "s2-l17", title: "Lesson 17: Introduction to Risk Management", content: "The most important topic. Understand that your primary job as a trader is to manage risk, not to be right all the time." },
          { id: "s2-l18", title: "Lesson 18: Setting a Stop-Loss", content: "Learn different methods for placing a stop-loss: based on a key level, a percentage of your account, or volatility (e.g., using ATR)." },
          { id: "s2-l19", title: "Lesson 19: Calculating Position Size", content: "Learn the formula to determine the correct lot size for any trade based on your account size, risk percentage, and stop-loss distance. This is crucial for capital preservation." },
          { id: "s2-l20", title: "Lesson 20: Risk-to-Reward Ratio", content: "Understand how to calculate and use the risk-to-reward ratio. Aim for trades where the potential profit is at least twice the potential loss (e.g., 1:2 R:R)." },
          { id: "s2-l21", title: "Lesson 21: Introduction to Fundamental Analysis", content: "Learn how major economic news releases, such as interest rate decisions, GDP, and employment data (like NFP), can dramatically impact currency prices." },
        ]
      },
      {
        stage: "Stage 3: Advanced Techniques",
        icon: 'BrainCircuit',
        description: "Master the psychological and risk aspects of trading to achieve consistency.",
        lessons: [
          {
            id: "lesson-10",
            title: "Lesson 10: Advanced Risk Management",
            content: "Implement strategies like the 1% rule (never risk more than 1% of your account on a single trade), using trailing stops to lock in profits, and calculating position size based on volatility and stop-loss distance."
          },
        ]
      }
    ]
  },
  ar: {
    pageTitle: "مسار Aura التعليمي",
    pageDescription: "منهج كامل يأخذك من مبتدئ إلى متداول منضبط. اتبع المراحل بالترتيب.",
    finalExamCard: {
        title: "الاختبار النهائي: اختبر معلوماتك",
        description: "بعد إكمال جميع الدروس، قم بإجراء الاختبار النهائي لتقييم فهمك وتحديد مستوى التداول الخاص بك.",
        buttonText: "أكمل جميع الدروس لفتح الاختبار",
        buttonTextActive: "بدء الاختبار النهائي",
        dialogTitle: "شروط الاختبار النهائي",
        dialogDescription: "أنت على وشك بدء الاختبار النهائي. هذا اختبار موقوت يحتوي على 10 أسئلة. يجب عليك الإجابة على جميع الأسئلة لرؤية نتيجتك. هل أنت مستعد للمتابعة؟",
        dialogAction: "الانتقال إلى الاختبار",
        dialogCancel: "إلغاء",
    },
    markAsRead: "وضع علامة كمقروء",
    lessonLocked: "أكمل الدرس السابق لفتح هذا الدرس",
    stages: [
      {
        stage: "المرحلة الأولى: أساسيات المبتدئين",
        icon: 'Star',
        description: "ابدأ رحلتك من هنا. تغطي هذه الدروس أساسيات تداول الفوركس.",
        lessons: [
          {
            id: "lesson-1",
            title: "الدرس 1: مقدمة في سوق الفوركس",
            subLessons: [
              { id: "1-1", title: "س1: ما هو سوق الفوركس؟", content: "سوق الصرف الأجنبي (الفوركس) هو سوق عالمي لا مركزي يتم فيه تداول العملات. إنه أكبر الأسواق المالية وأكثرها سيولة في العالم، حيث يقوم المشاركون بشراء وبيع وتبادل العملات بأسعار محددة." },
              { id: "1-2", title: "س2: كيف يعمل تداول الفوركس؟", content: "يتم تداول الفوركس في أزواج عملات (مثل EUR/USD). عند التداول، أنت تراهن على ارتفاع أو انخفاض قيمة عملة مقابل أخرى. أنت تشتري عملة وتبيع الأخرى في نفس الوقت." },
              { id: "1-3", title: "س3: ما هي الجلسات الرئيسية في سوق الفوركس؟", content: "يعمل السوق 24 ساعة يوميًا، خمسة أيام في الأسبوع، عبر أربع جلسات تداول رئيسية: سيدني، طوكيو، لندن، ونيويورك. فترة التداخل بين هذه الجلسات، خاصة لندن ونيويورك، تشهد أعلى حجم تداول." },
              { id: "1-4", title: "س4: من هم المشاركون الرئيسيون في سوق الفوركس؟", content: "يشمل المشاركون الرئيسيون البنوك المركزية، البنوك التجارية والاستثمارية الكبيرة (سوق ما بين البنوك)، صناديق التحوط، الشركات، والمتداولين الأفراد (المستثمرين الأفراد)." },
              { id: "1-5", title: "س5: ما هي أزواج العملات 'الرئيسية'؟", content: "الأزواج الرئيسية هي الأكثر تداولًا في العالم. جميعها تشمل الدولار الأمريكي (USD) وتُعرف بسيولتها العالية. من الأمثلة: EUR/USD، GBP/USD، و USD/JPY." },
              { id: "1-6", title: "س6: ما هي أزواج العملات 'الثانوية' أو 'التقاطعية'؟", content: "الأزواج الثانوية، أو الأزواج التقاطعية، هي أزواج لا تشمل الدولار الأمريكي. تتكون من عملات رئيسية أخرى، مثل EUR/GBP، EUR/JPY، أو GBP/AUD." },
              { id: "1-7", title: "س7: ما هي أزواج العملات 'الغريبة'؟", content: "تتكون الأزواج الغريبة من عملة رئيسية مقترنة بعملة من اقتصاد ناشئ. من الأمثلة: USD/TRY (الدولار الأمريكي/الليرة التركية) أو EUR/MXN (اليورو/البيزو المكسيكي). هي أقل سيولة ولها فروق أسعار أوسع." },
              { id: "1-8", title: "س8: ماذا يعني أن يكون السوق 'لا مركزي'؟", content: "السوق اللامركزي، مثل الفوركس، ليس له موقع مادي مركزي أو بورصة. يتم التداول إلكترونيًا خارج البورصة (OTC)، مما يعني أن جميع المعاملات تتم عبر شبكات الكمبيوتر بين المتداولين في جميع أنحاء العالم." },
              { id: "1-9", title: "س9: كيف تقرأ تسعيرة فوركس مثل EUR/USD = 1.0850؟", content: "العملة الأولى (EUR) هي العملة 'الأساس'، والثانية (USD) هي 'عملة التسعير'. التسعيرة تعني أن 1 يورو يساوي 1.0850 دولار أمريكي. العملة الأساسية دائمًا قيمتها 1." },
              { id: "1-10", title: "س10: ما الفرق بين شراء وبيع زوج عملات؟", content: "إذا 'اشتريت' EUR/USD، فأنت تشتري اليورو وتبيع الدولار الأمريكي، متوقعًا أن اليورو سيقوى. إذا 'بعت' EUR/USD، فأنت تبيع اليورو وتشتري الدولار الأمريكي، متوقعًا أن اليورو سيضعف." },
              { id: "1-11", title: "س11: ما الذي يحرك سوق الفوركس؟", content: "يتحرك السوق بفعل مجموعة من العوامل، بما في ذلك أسعار الفائدة، التضخم، الاستقرار السياسي، الأداء الاقتصادي، والمضاربة. هذه العوامل تؤثر على العرض والطلب على العملات." },
              { id: "1-12", title: "س12: ما هي 'السيولة' في الفوركس؟", content: "تشير السيولة إلى القدرة على شراء أو بيع زوج عملات دون التسبب في تغيير كبير في سعر صرفه. سوق الفوركس سائل للغاية، مما يعني أنه يمكن تنفيذ الطلبات الكبيرة بسهولة وفروق الأسعار غالبًا ما تكون ضيقة، خاصة للأزواج الرئيسية." },
              { id: "1-13", title: "س13: هل سوق الفوركس منظم؟", content: "بينما السوق لا مركزي، تشرف هيئات تنظيمية في بلدان مختلفة على وسطاء الفوركس لضمان سلوك عادل وأخلاقي. من الأمثلة: FCA في المملكة المتحدة و ASIC في أستراليا." },
              { id: "1-14", title: "س14: ما هو 'الوسيط' في الفوركس؟", content: "وسيط الفوركس هو شركة خدمات مالية توفر للمتداولين منصة لشراء وبيع العملات الأجنبية. يحتاج المتداولون الأفراد إلى وسيط للمشاركة في السوق." },
              { id: "1-15", title: "س15: ما هي مزايا تداول الفوركس؟", content: "تشمل المزايا السيولة العالية، الوصول إلى السوق على مدار 24 ساعة، القدرة على التداول بالرافعة المالية، وإمكانية الربح من الأسواق الصاعدة والهابطة على حد سواء." },
              { id: "1-16", title: "س16: ما هي مخاطر تداول الفوركس؟", content: "تشمل المخاطر الرئيسية احتمالية حدوث خسائر كبيرة بسبب الرافعة المالية، تقلبات السوق، والطبيعة المعقدة للعوامل الاقتصادية العالمية. إدارة المخاطر أمر بالغ الأهمية." },
              { id: "1-17", title: "س17: ما هو 'سوق ما بين البنوك'؟", content: "سوق ما بين البنوك هو الشبكة العالمية التي تستخدمها المؤسسات المالية لتداول العملات فيما بينها. يتداولون مباشرة، وهذا السوق يحدد الأسعار التي يتم تقديمها بعد ذلك للمتداولين الأفراد." },
              { id: "1-18", title: "س18: ما هو 'زوج العملات'؟", content: "زوج العملات هو تسعيرة لعملتين مختلفتين، حيث يتم تسعير قيمة عملة مقابل الأخرى. على سبيل المثال، في GBP/USD، يتم تسعير قيمة الجنيه الإسترليني مقابل الدولار الأمريكي." },
              { id: "1-19", title: "س19: لماذا يعتبر الدولار الأمريكي مهمًا جدًا في الفوركس؟", content: "الدولار الأمريكي هو العملة الاحتياطية الرئيسية في العالم. يشارك في غالبية التجارة العالمية وهو طرف في معظم معاملات الفوركس، مما يجعله العملة الأكثر تداولًا." },
              { id: "1-20", title: "س20: هل يمكنك تداول الفوركس في عطلات نهاية الأسبوع؟", content: "لا، سوق الفوركس للأفراد مغلق في عطلات نهاية الأسبوع. يغلق مساء الجمعة (بتوقيت نيويورك) ويعاد فتحه مساء الأحد (بتوقيت سيدني). يمكن للأسعار أن 'تقفز' خلال عطلة نهاية الأسبوع إذا حدثت أخبار مهمة." }
            ]
          },
          {
            id: "lesson-2",
            title: "الدرس 2: المصطلحات الرئيسية",
            subLessons: [
              { id: "2-1", title: "س1: ما هي 'النقطة' (Pip)؟", content: "'النقطة' (Pip) هي وحدة موحدة وأصغر كمية يمكن أن يتغير بها سعر العملة. لمعظم أزواج العملات، النقطة الواحدة هي تغيير في الخانة العشرية الرابعة (مثل 0.0001)." },
              { id: "2-2", title: "س2: ما هي 'النقطة الجزئية' (Pipette)؟", content: "'النقطة الجزئية' (Pipette) تمثل جزءًا من النقطة. وهي الخانة العشرية الخامسة في معظم أسعار العملات (مثل 0.00001)، وتسمح بتسعير أكثر دقة." },
              { id: "2-3", title: "س3: ما هو سعر 'الطلب' (Bid)؟", content: "سعر 'الطلب' هو السعر الذي يرغب الوسيط في شراء العملة الأساسية به منك. إنه السعر الذي يمكنك أنت، كمتداول، 'بيع' الزوج به." },
              { id: "2-4", title: "س4: ما هو سعر 'العرض' (Ask)؟", content: "سعر 'العرض' هو السعر الذي يرغب الوسيط في بيع العملة الأساسية به لك. إنه السعر الذي يمكنك أنت، كمتداول، 'شراء' الزوج به. سعر العرض دائمًا أعلى بقليل من سعر الطلب." },
              { id: "2-5", title: "س5: ما هو 'الفارق السعري' (Spread)؟", content: "الفارق السعري هو الفرق بين سعر العرض وسعر الطلب. هذه هي الطريقة الأساسية التي يجني بها وسطاء الفوركس أموالهم. الفارق الأصغر أفضل للمتداول." },
              { id: "2-6", title: "س6: ما هي 'الرافعة المالية'؟", content: "الرافعة المالية هي أداة يقدمها الوسطاء تسمح للمتداولين بالتحكم في مركز كبير في السوق بكمية صغيرة نسبيًا من رأس مالهم الخاص. على سبيل المثال، رافعة 100:1 تعني أنه يمكنك التحكم بمركز قيمته 100,000 دولار بـ 1,000 دولار فقط." },
              { id: "2-7", title: "س7: ما هو 'الهامش' (Margin)؟", content: "الهامش هو مقدار المال المطلوب في حسابك لفتح مركز برافعة مالية والحفاظ عليه. إنه ليس رسماً، بل جزء من رصيد حسابك يتم حجزه كوديعة. على سبيل المثال، مع رافعة 100:1، يكون الهامش لمركز بقيمة 100,000 دولار هو 1,000 دولار." },
              { id: "2-8", title: "س8: ما هو 'نداء الهامش' (Margin Call)؟", content: "يحدث نداء الهامش عندما ينخفض رصيد حسابك عن مستوى الهامش المطلوب للحفاظ على مراكزك المفتوحة. سيطلب منك الوسيط إيداع المزيد من الأموال أو سيغلق بعض/كل مراكزك لتغطية خسائرك." },
              { id: "2-9", title: "س9: ما هو 'العقد' (Lot)؟", content: "العقد هو وحدة قياس لحجم الصفقة. 'العقد القياسي' هو 100,000 وحدة من العملة الأساسية. هذا هو الحجم القياسي لعقد التداول." },
              { id: "2-10", title: "س10: ما هي العقود 'المصغرة' و 'المايكرو'؟", content: "'العقد المصغر' (Mini Lot) هو 10,000 وحدة من العملة الأساسية (0.1 من العقد القياسي). و'العقد المايكرو' (Micro Lot) هو 1,000 وحدة (0.01 من العقد القياسي). تتيح أحجام العقود الصغيرة هذه للمتداولين برأس مال أقل المشاركة في السوق وإدارة المخاطر." },
              { id: "2-11", title: "س11: ماذا يعني 'شراء' (Long) و 'بيع' (Short)؟", content: "الدخول في صفقة 'شراء' يعني أنك تشتري زوج عملات، متوقعًا ارتفاع قيمته. والدخول في صفقة 'بيع' يعني أنك تبيع زوج عملات، متوقعًا انخفاض قيمته." },
              { id: "2-12", title: "س12: ما هو 'الانزلاق السعري' (Slippage)؟", content: "يحدث الانزلاق السعري عندما يتم تنفيذ الصفقة بسعر مختلف عن السعر المطلوب. يحدث هذا عادة خلال فترات التقلب الشديد أو عند تنفيذ طلب كبير." },
              { id: "2-13", title: "س13: ما هو السوق 'الصاعد' (Bullish) مقابل 'الهابط' (Bearish)؟", content: "السوق 'الصاعد' هو سوق تتجه فيه الأسعار نحو الأعلى. والسوق 'الهابط' هو سوق تتجه فيه الأسعار نحو الأسفل. السوق الصاعد يدل على التفاؤل، بينما السوق الهابط يدل على التشاؤم." },
              { id: "2-14", title: "س14: ما هي 'التقلبات' (Volatility)؟", content: "التقلبات هي مقياس لتكرار وحجم التغيرات في الأسعار. السوق شديد التقلب يشهد تقلبات سعرية كبيرة، مما يوفر إمكانية ربح أكبر ولكنه يحمل مخاطر أكبر أيضًا." },
              { id: "2-15", title: "س15: ما هو أمر 'جني الأرباح' (Take Profit)؟", content: "أمر جني الأرباح هو أمر تضعه لإغلاق صفقة رابحة تلقائيًا بمجرد وصولها إلى مستوى سعر معين. يستخدم لتأمين الأرباح." },
              { id: "2-16", title: "س16: ما هو أمر 'وقف الخسارة' (Stop-Loss)؟", content: "أمر وقف الخسارة هو أمر تضعه لإغلاق صفقة خاسرة تلقائيًا بمجرد وصولها إلى مستوى سعر معين. إنه أداة حاسمة لإدارة المخاطر للحد من الخسائر المحتملة." },
              { id: "2-17", title: "س17: ما هي العملة 'الأساس'؟", content: "العملة الأساس هي العملة الأولى في زوج العملات (مثل اليورو في EUR/USD). يوضح سعر الصرف كمية عملة التسعير المطلوبة لشراء وحدة واحدة من العملة الأساس." },
              { id: "2-18", title: "س18: ما هي عملة 'التسعير'؟", content: "عملة التسعير هي العملة الثانية في زوج العملات (مثل الدولار الأمريكي في EUR/USD). هي العملة التي يتم تقييم العملة الأساس بها." },
              { id: "2-19", title: "س19: ما هو 'التبييت' أو 'المبادلة' (Rollover/Swap)؟", content: "التبييت (أو المبادلة) هو الفائدة المدفوعة أو المكتسبة مقابل الاحتفاظ بمركز مفتوح لليوم التالي. يعتمد على فرق سعر الفائدة بين العملتين في الزوج." },
              { id: "2-20", title: "س20: ما هو 'التحوط' (Hedging)؟", content: "التحوط هو استراتيجية تستخدم لحماية مركز من حركة معاكسة. في الفوركس، قد يتضمن ذلك فتح مركز ثانٍ في الاتجاه المعاكس لصفقتك الأولية للحد من الخسائر." }
            ]
          },
          {
            id: "lesson-3",
            title: "الدرس 3: أنواع الأوامر",
            subLessons: [
              { id: "3-1", title: "س1: ما هو أمر السوق (Market Order)؟", content: "أمر السوق هو تعليمات للوسيط بتنفيذ صفقة فورًا بأفضل سعر متاح. إنه أسرع طريقة للدخول أو الخروج من السوق." },
              { id: "3-2", title: "س2: متى يجب استخدام أمر السوق؟", content: "استخدم أمر السوق عندما يكون هدفك الأساسي هو الدخول في صفقة بسرعة، وتكون أقل قلقًا بشأن سعر الدخول الدقيق. إنه شائع في الأسواق سريعة الحركة." },
              { id: "3-3", title: "س3: ما هو الأمر المحدد (Limit Order)؟", content: "الأمر المحدد هو تعليمات لتنفيذ صفقة بسعر محدد أو أفضل. يمنحك هذا التحكم في سعر الدخول أو الخروج." },
              { id: "3-4", title: "س4: ما هو أمر 'الشراء المحدد' (Buy Limit)؟", content: "يتم وضع أمر الشراء المحدد تحت سعر السوق الحالي. يتم تنفيذ الصفقة فقط إذا انخفض سعر السوق إلى السعر المحدد أو أقل." },
              { id: "3-5", title: "س5: ما هو أمر 'البيع المحدد' (Sell Limit)؟", content: "يتم وضع أمر البيع المحدد فوق سعر السوق الحالي. يتم تنفيذ الصفقة فقط إذا ارتفع سعر السوق إلى السعر المحدد أو أعلى." },
              { id: "3-6", title: "س6: ما هو أمر الإيقاف (Stop Order)؟", content: "أمر الإيقاف هو تعليمات لشراء أو بيع زوج عملات بمجرد وصوله إلى سعر معين. غالبًا ما يستخدم لتداول الاختراقات." },
              { id: "3-7", title: "س7: ما هو أمر 'الشراء الموقوف' (Buy Stop)؟", content: "يتم وضع أمر الشراء الموقوف فوق سعر السوق الحالي. يتم تنفيذه فقط عندما يرتفع سعر السوق إلى ذلك المستوى. يستخدمه المتداولون للشراء عند اختراق مستوى مقاومة." },
              { id: "3-8", title: "س8: ما هو أمر 'البيع الموقوف' (Sell Stop)؟", content: "يتم وضع أمر البيع الموقوف تحت سعر السوق الحالي. يتم تنفيذه فقط عندما ينخفض سعر السوق إلى ذلك المستوى. يستخدمه المتداولون للبيع عند اختراق مستوى دعم." },
              { id: "3-9", title: "س9: ما الفرق بين الأمر المحدد وأمر الإيقاف؟", content: "يستخدم الأمر المحدد للدخول إلى السوق بسعر أفضل (شراء بسعر منخفض، بيع بسعر مرتفع). يستخدم أمر الإيقاف للدخول إلى السوق عندما يكتسب زخمًا في اتجاه معين (شراء بسعر مرتفع، بيع بسعر منخفض)." },
              { id: "3-10", title: "س10: ما هو أمر وقف الخسارة؟", content: "وقف الخسارة (SL) هو أمر دفاعي مرتبط بصفقتك المفتوحة. يغلق مركزك تلقائيًا إذا تحرك السوق ضدك بمقدار محدد، مما يحد من خسارتك المحتملة." },
              { id: "3-11", title: "س11: لماذا يعتبر أمر وقف الخسارة أساسيًا؟", content: "إنه أهم أداة لإدارة المخاطر. يحمي رأس مالك من خسائر كبيرة ويزيل العاطفة من قرار الخروج من صفقة خاسرة." },
              { id: "3-12", title: "س12: ما هو أمر جني الأرباح؟", content: "جني الأرباح (TP) هو أمر مرتبط بصفقتك المفتوحة. يغلق مركزك تلقائيًا عندما يصل إلى مستوى معين من الربح، مما يضمن تأمين مكاسبك." },
              { id: "3-13", title: "س13: ما هو أمر 'الإيقاف المتحرك' (Trailing Stop)؟", content: "الإيقاف المتحرك هو نوع من أوامر وقف الخسارة يتحرك مع سعر الصفقة الرابحة. يتم تعيينه بنسبة مئوية معينة أو عدد نقاط تحت (لصفقة شراء) أو فوق (لصفقة بيع) سعر السوق، مما يؤمن الأرباح مع تحرك الصفقة لصالحك." },
              { id: "3-14", title: "س14: ما هو الأمر 'ساري حتى الإلغاء' (GTC)؟", content: "أمر GTC يظل نشطًا في السوق حتى تقرر إلغاءه. معظم الأوامر المعلقة (Limit, Stop) هي GTC افتراضيًا." },
              { id: "3-15", title: "س15: ما هو الأمر 'صالح لليوم' (GFD)؟", content: "أمر GFD يظل نشطًا حتى نهاية يوم التداول. إذا لم يتم تنفيذه بحلول إغلاق السوق، يتم إلغاؤه تلقائيًا." },
              { id: "3-16", title: "س16: ما هو أمر 'الأمر يلغي الآخر' (OCO)؟", content: "أمر OCO يجمع بين أمرين معلقين (عادةً أمر محدد وأمر إيقاف). إذا تم تنفيذ أحد الأوامر، يتم إلغاء الآخر تلقائيًا. هذا مفيد لتداول النطاقات أو الاختراقات." },
              { id: "3-17", title: "س17: كيف ينفذ الوسيط الأوامر؟", content: "يمكن للوسطاء أن يكونوا 'غرفة مقاصة' (صناع سوق) يأخذون الجانب الآخر من صفقتك، أو 'بدون غرفة مقاصة' (ECN/STP) يمررون أوامرك مباشرة إلى سوق ما بين البنوك." },
              { id: "3-18", title: "س18: ما هو 'سعر الدخول'؟", content: "سعر الدخول هو السعر الذي يتم عنده تنفيذ صفقتك، ويتم فتح مركزك رسميًا في السوق." },
              { id: "3-19", title: "س19: هل يمكن تعديل الأوامر المعلقة؟", content: "نعم، يمكنك دائمًا تقريبًا تعديل أو إلغاء أمر معلق (مثل شراء محدد أو بيع موقوف) في أي وقت قبل تنفيذه." },
              { id: "3-20", title: "س20: ما هو 'التنفيذ' (Fill)؟", content: "'التنفيذ' هو إتمام تنفيذ أمر ما. 'التنفيذ الجزئي' هو عندما يتم تنفيذ جزء فقط من طلبك بسعر معين." }
            ]
          },
          {
            id: "lesson-4",
            title: "الدرس 4: أنواع التحليل",
            subLessons: [
              { id: "4-1", title: "س1: ما هي الأنواع الثلاثة الرئيسية لتحليل السوق؟", content: "الأنواع الثلاثة الرئيسية هي: التحليل الفني، والتحليل الأساسي، وتحليل المعنويات." },
              { id: "4-2", title: "س2: ما هو التحليل الفني؟", content: "التحليل الفني يتضمن توقع تحركات الأسعار المستقبلية من خلال فحص بيانات السوق السابقة، وبشكل أساسي السعر والحجم. يستخدم الرسوم البيانية والمؤشرات لتحديد الأنماط والاتجاهات." },
              { id: "4-3", title: "س3: ما هو الافتراض الأساسي للتحليل الفني؟", content: "الافتراض الأساسي هو أن جميع المعلومات المعروفة تنعكس بالفعل في السعر. لذلك، دراسة حركة السعر هي كل ما هو مطلوب لاتخاذ قرارات التداول. التاريخ يميل إلى تكرار نفسه." },
              { id: "4-4", title: "س4: ما هي الأدوات المستخدمة في التحليل الفني؟", content: "تشمل الأدوات أنماط الرسوم البيانية (مثل الرأس والكتفين)، خطوط الاتجاه، مستويات الدعم والمقاومة، والمؤشرات الفنية (مثل المتوسطات المتحركة، RSI، MACD)." },
              { id: "4-5", title: "س5: ما هو التحليل الأساسي؟", content: "التحليل الأساسي يتضمن تقييم القيمة الجوهرية للعملة من خلال فحص العوامل الاقتصادية والمالية ذات الصلة. الهدف هو تحديد ما إذا كانت العملة مقومة بأعلى من قيمتها أو بأقل." },
              { id: "4-6", title: "س6: ما هي العوامل التي يتم النظر فيها في التحليل الأساسي؟", content: "تشمل العوامل الرئيسية أسعار الفائدة التي تحددها البنوك المركزية، نمو الناتج المحلي الإجمالي، معدلات التضخم (CPI)، بيانات التوظيف (مثل NFP)، والاستقرار السياسي." },
              { id: "4-7", title: "س7: كيف تؤثر أسعار الفائدة على العملة؟", content: "أسعار الفائدة المرتفعة تجعل العملة بشكل عام أكثر جاذبية للمستثمرين الأجانب، مما يزيد الطلب ويؤدي إلى ارتفاع قيمة العملة. وعلى العكس، يمكن أن تضعف أسعار الفائدة المنخفضة العملة." },
              { id: "4-8", title: "س8: ما هو تحليل المعنويات؟", content: "تحليل المعنويات يتضمن قياس المزاج العام أو شعور المشاركين في السوق ('الجمهور') تجاه زوج عملات معين. يسأل: 'هل السوق بشكل عام صعودي أم هبوطي؟'" },
              { id: "4-9", title: "س9: كيف يمكنك قياس معنويات السوق؟", content: "يمكن قياس المعنويات من خلال أدوات مثل تقرير التزام المتداولين (COT)، الذي يوضح مراكز كبار المتداولين، ومن خلال مراقبة عناوين الأخبار وبيانات تمركز السوق من الوسطاء." },
              { id: "4-10", title: "س10: هل يجب استخدام نوع واحد فقط من التحليل؟", content: "لا. يستخدم معظم المتداولين الناجحين مزيجًا من أنواع التحليل. على سبيل المثال، قد يستخدمون التحليل الأساسي لتحديد الاتجاه طويل الأجل والتحليل الفني للعثور على نقاط دخول وخروج دقيقة." },
              { id: "4-11", title: "س11: ما هو نهج التحليل 'من الأعلى إلى الأسفل'؟", content: "يتضمن هذا البدء بنظرة اقتصادية كلية واسعة (التحليل الأساسي) لتحديد الاقتصادات القوية مقابل الضعيفة، ثم الانتقال إلى أزواج عملات محددة واستخدام التحليل الفني لتوقيت الصفقات." },
              { id: "4-12", title: "س12: ما هو نهج 'من الأسفل إلى الأعلى'؟", content: "يركز هذا النهج بشكل أساسي على نمط أو إشارة فردية في الرسم البياني (التحليل الفني) ثم يعتبر العوامل الأساسية كتأكيد ثانوي." },
              { id: "4-13", title: "س13: ما هو تداول 'حركة السعر' (Price Action)؟", content: "تداول حركة السعر هو شكل من أشكال التحليل الفني يركز فقط على قراءة مخطط الشموع اليابانية نفسه، دون الاعتماد بشكل كبير على المؤشرات المتأخرة. إنه يتعلق بفهم القصة التي يرويها السعر." },
              { id: "4-14", title: "س14: ما هو 'التحليل الكمي'؟", content: "هذا نهج رياضي وإحصائي للغاية لتحليل بيانات السوق. غالبًا ما تستخدمه صناديق التحوط والمؤسسات المالية الكبيرة لبناء خوارزميات تداول معقدة." },
              { id: "4-15", title: "س15: كيف يمكن للأحداث الإخبارية أن تؤثر على الأنماط الفنية؟", content: "يمكن لخبر اقتصادي كبير (مثل قرار سعر الفائدة) أن يبطل نمطًا فنيًا تمامًا. هذا هو السبب في أن العديد من المتداولين الفنيين يتجنبون الاحتفاظ بمراكز أثناء الأحداث الإخبارية الكبرى." },
              { id: "4-16", title: "س16: ما هو الإطار الزمني الأفضل للتحليل الأساسي؟", content: "تميل العوامل الأساسية إلى أن تتجلى على مدى فترات أطول. لذلك، يكون التحليل الأساسي أكثر فائدة للمتداولين على المدى الطويل (متداولي السوينغ أو المراكز) الذين يحتفظون بصفقات لأيام أو أسابيع أو أشهر." },
              { id: "4-17", title: "س17: ما هو الإطار الزمني الأفضل للتحليل الفني؟", content: "يمكن تطبيق التحليل الفني على أي إطار زمني، من الرسوم البيانية للدقيقة الواحدة (للسكالبينج) إلى الرسوم البيانية الأسبوعية (لمتداولي المراكز). المبادئ تظل كما هي." },
              { id: "4-18", title: "س18: ما هو المؤشر 'الرائد' (leading)؟", content: "المؤشر الرائد مصمم ليسبق تحركات الأسعار المستقبلية. من الأمثلة على ذلك مؤشر القوة النسبية (RSI) ومذبذب ستوكاستيك، اللذان يمكن أن يشيران إلى ظروف التشبع الشرائي/البيعي قبل انعكاس السعر." },
              { id: "4-19", title: "س19: ما هو المؤشر 'المتأخر' (lagging)؟", content: "المؤشر المتأخر يتبع حركة السعر ويؤكد ما حدث بالفعل. المتوسطات المتحركة هي مثال كلاسيكي. إنها مفيدة لتأكيد اتجاه الاتجاه." },
              { id: "4-20", title: "س20: كيف تعمل أنواع التحليل الثلاثة معًا؟", content: "1. الأساسيات تخبرك لماذا قد يتحرك السوق. 2. الفنيات تخبرك متى قد يتحرك. 3. المعنويات تخبرك إلى أي مدى قد يتحرك بناءً على تمركز السوق الحالي." }
            ]
          }
        ]
      },
      {
        stage: "المرحلة الثانية: استراتيجيات للمتوسطين",
        icon: 'Target',
        description: "ابنِ على معرفتك بالأنماط الفنية والمؤشرات وإدارة المخاطر.",
        lessons: [
          { 
            id: "s2-l1", 
            title: "الدرس 1: مقدمة في أنواع الرسوم البيانية", 
            subLessons: [
                {id: "s2-l1-1", title: "س1: ما هي أنواع الرسوم البيانية الثلاثة الرئيسية في التداول؟", content: "أنواع الرسوم البيانية الثلاثة الرئيسية هي: الرسوم البيانية الخطية، والرسوم البيانية الشريطية، والرسوم البيانية بالشموع اليابانية."},
                {id: "s2-l1-2", title: "س2: كيف يعمل الرسم البياني الخطي؟", content: "الرسم البياني الخطي هو أبسط نوع. يربط سلسلة من أسعار الإغلاق خلال فترة محددة، مكونًا خطًا واحدًا متصلاً. إنه مفيد لرؤية الاتجاه العام ولكنه يفتقر إلى التفاصيل."},
                {id: "s2-l1-3", title: "س3: ما هي المعلومات التي يقدمها الرسم البياني الخطي؟", content: "يقدم فقط سعر الإغلاق لكل فترة. لا يمكنك رؤية أسعار الافتتاح أو الأعلى أو الأدنى لتلك الفترة."},
                {id: "s2-l1-4", title: "س4: ما هو الرسم البياني الشريطي (مخطط OHLC)؟", content: "يقدم الرسم البياني الشريطي معلومات أكثر من الرسم البياني الخطي. يمثل كل شريط فترة واحدة ويظهر أربعة أسعار رئيسية: الافتتاح، الأعلى، الأدنى، والإغلاق (OHLC)."},
                {id: "s2-l1-5", title: "س5: كيف تقرأ شريطًا في الرسم البياني الشريطي؟", content: "يُظهر الخط العمودي النطاق بين السعر الأعلى والأدنى. علامة أفقية صغيرة على اليسار تُظهر سعر الافتتاح، وعلامة أفقية صغيرة على اليمين تُظهر سعر الإغلاق."},
                {id: "s2-l1-6", title: "س6: ما هو الرسم البياني بالشموع اليابانية؟", content: "الرسم البياني بالشموع اليابانية هو النوع الأكثر شيوعًا. مثل الرسم البياني الشريطي، فإنه يُظهر أسعار الافتتاح، الأعلى، الأدنى، والإغلاق، ولكنه يفعل ذلك بطريقة مرئية أسهل في القراءة."},
                {id: "s2-l1-7", title: "س7: ما هي مكونات الشمعة اليابانية؟", content: "تتكون الشمعة من جزأين رئيسيين: 'الجسم' (الجزء العريض) و'الفتائل' أو 'الظلال' (الخطوط الرفيعة الممتدة من الجسم)."},
                {id: "s2-l1-8", title: "س8: ماذا يمثل 'جسم' الشمعة؟", content: "يمثل الجسم النطاق بين سعر الافتتاح وسعر الإغلاق لتلك الفترة. ويشير لونه إلى اتجاه حركة السعر."},
                {id: "s2-l1-9", title: "س9: ماذا يعني جسم الشمعة الأخضر (أو الأبيض/الأزرق)؟", content: "الشمعة الخضراء (أو الصاعدة) تعني أن سعر الإغلاق كان أعلى من سعر الافتتاح. ارتفع السعر خلال تلك الفترة."},
                {id: "s2-l1-10", title: "س10: ماذا يعني جسم الشمعة الأحمر (أو الأسود)؟", content: "الشمعة الحمراء (أو الهابطة) تعني أن سعر الإغلاق كان أقل من سعر الافتتاح. انخفض السعر خلال تلك الفترة."},
                {id: "s2-l1-11", title: "س11: ماذا تظهر 'الفتائل' (أو الظلال) للشمعة؟", content: "تُظهر الفتائل أعلى وأدنى الأسعار التي تم الوصول إليها خلال الفترة. قمة الفتيل العلوي هي الأعلى، وأسفل الفتيل السفلي هو الأدنى."},
                {id: "s2-l1-12", title: "س12: لماذا تحظى الرسوم البيانية بالشموع اليابانية بشعبية كبيرة؟", content: "لأنها تجعل من السهل رؤية العلاقة بين الافتتاح والإغلاق، وكذلك الأعلى والأدنى. يمكن للألوان والأنماط التي تشكلها الشموع أن تكشف عن سيكولوجية السوق."},
                {id: "s2-l1-13", title: "س13: ما هي المعلومات التي تفقدها مع الرسم البياني الخطي؟", content: "مع الرسم البياني الخطي، تفقد كل المعلومات حول تقلبات السعر داخل الفترة. لا تعرف سعر الافتتاح أو الأعلى أو الأدنى، فقط أين انتهت الفترة."},
                {id: "s2-l1-14", title: "س14: ما هو 'الإطار الزمني' في الرسوم البيانية؟", content: "الإطار الزمني هو المدة التي يمثلها كل شريط أو شمعة. تشمل الأطر الزمنية الشائعة دقيقة واحدة (M1)، وساعة واحدة (H1)، و4 ساعات (H4)، ويومي (D1)، وأسبوعي (W1)."},
                {id: "s2-l1-15", title: "س15: كيف يؤثر تغيير الإطار الزمني على الرسم البياني؟", content: "يُظهر الإطار الزمني الأصغر (مثل M5) مزيدًا من التفاصيل والضوضاء في تحركات الأسعار. بينما يقوم الإطار الزمني الأكبر (مثل D1) بتصفية الضوضاء وإظهار الاتجاه الأكثر أهمية على المدى الطويل."},
                {id: "s2-l1-16", title: "س16: أي نوع من الرسوم البيانية هو الأفضل لتحديد الأنماط؟", content: "الرسوم البيانية بالشموع اليابانية هي الأفضل بفارق كبير لتحديد أنماط الأسعار. الطبيعة المرئية للشموع تجعل الأنماط مثل 'الابتلاعية' أو 'الدوجي' أسهل بكثير في الرصد."},
                {id: "s2-l1-17", title: "س17: ماذا يوحي الفتيل العلوي الطويل على الشمعة؟", content: "الفتيل العلوي الطويل يوحي بأن المشترين حاولوا دفع السعر للأعلى بشكل كبير، لكن البائعين تدخلوا ودفعوه للأسفل مرة أخرى قبل إغلاق الفترة. يمكن أن يكون علامة على ضغط البيع."},
                {id: "s2-l1-18", title: "س18: ماذا يوحي الفتيل السفلي الطويل على الشمعة؟", content: "الفتيل السفلي الطويل يوحي بأن البائعين حاولوا دفع السعر للأسفل، لكن المشترين تدخلوا ودفعوه للأعلى مرة أخرى قبل الإغلاق. يمكن أن يكون علامة على ضغط الشراء."},
                {id: "s2-l1-19", title: "س19: هل يمكنك استخدام أنواع مختلفة من الرسوم البيانية معًا؟", content: "نعم. قد يستخدم بعض المتداولين الرسم البياني الخطي على إطار زمني أعلى لرؤية الاتجاه النظيف طويل الأجل، ثم ينتقلون إلى الرسم البياني بالشموع على إطار زمني أقل للعثور على نقاط دخول دقيقة."},
                {id: "s2-l1-20", title: "س20: بالنسبة للمبتدئين، أي نوع من الرسوم البيانية يوصى بالبدء به؟", content: "يوصى بشدة بالرسوم البيانية بالشموع اليابانية. على الرغم من أنها تتطلب منحنى تعلم بسيطًا، إلا أن كمية المعلومات والوضوح الذي توفره ضروريان لتعلم التحليل الفني الحديث."}
            ]
          },
          { 
            id: "s2-l2", 
            title: "الدرس 2: تعمق في الشموع اليابانية", 
            subLessons: [
                { id: "s2-l2-1", title: "س1: ما هو المبدأ الأساسي لتحليل الشمعة الواحدة؟", content: "المبدأ الأساسي هو أن شكل الشمعة الواحدة يمكن أن يكشف عن سيكولوجية السوق (المعركة بين المشترين والبائعين) خلال تلك الفترة المحددة، وغالبًا ما يشير إلى انعكاسات محتملة أو تردد." },
                { id: "s2-l2-2", title: "س2: ما هي شمعة 'الدوجي' (Doji)؟", content: "الدوجي هي شمعة بجسم صغير جدًا أو غير موجود، مما يعني أن أسعار الافتتاح والإغلاق متطابقة تقريبًا. إنها تشير إلى التردد ونقطة تحول محتملة في السوق." },
                { id: "s2-l2-3", title: "س3: ما هي الأنواع الرئيسية للدوجي؟", content: "الأنواع الرئيسية هي الدوجي المحايد (شكل صليب)، الدوجي طويل الأرجل (فتائل علوية وسفلية طويلة)، دوجي اليعسوب (فتيل سفلي طويل، بدون فتيل علوي)، ودوجي شاهد القبر (فتيل علوي طويل، بدون فتيل سفلي)." },
                { id: "s2-l2-4", title: "س4: ماذا يوحي 'دوجي اليعسوب' (Dragonfly Doji) في قاع اتجاه هابط؟", content: "إنها إشارة انعكاس صعودية قوية. تظهر أن البائعين دفعوا السعر للأسفل، لكن المشترين سيطروا تمامًا بحلول نهاية الفترة، ودفعوا السعر مرة أخرى إلى سعر الافتتاح." },
                { id: "s2-l2-5", title: "س5: ماذا يوحي 'دوجي شاهد القبر' (Gravestone Doji) في قمة اتجاه صاعد؟", content: "إنها إشارة انعكاس هبوطية قوية. تظهر أن المشترين دفعوا السعر للأعلى، لكن البائعين تغلبوا عليهم، ودفعوا السعر مرة أخرى إلى سعر الافتتاح." },
                { id: "s2-l2-6", title: "س6: ما هي شمعة 'القمة الدوارة' (Spinning Top)؟", content: "القمة الدوارة لها جسم صغير بفتائل علوية وسفلية طويلة متساوية الحجم. مثل الدوجي، تدل على التردد في السوق، حيث لم يتمكن أي من المشترين أو البائعين من السيطرة." },
                { id: "s2-l2-7", title: "س7: ما هي شمعة 'المطرقة' (Hammer)؟", content: "المطرقة هي نمط انعكاس صعودي يوجد في قاع اتجاه هابط. لها جسم صغير في الأعلى، وفتيل سفلي طويل (على الأقل ضعف حجم الجسم)، وقليل من الفتيل العلوي أو لا يوجد." },
                { id: "s2-l2-8", title: "س8: ما هي النفسية وراء شمعة المطرقة؟", content: "تظهر أن البائعين كانوا مسيطرين في البداية، ودفعوا السعر إلى الأسفل. ومع ذلك، ظهر ضغط شراء قوي، وارتفع السعر ليغلق بالقرب من افتتاحه، مما يشير إلى قاع محتمل." },
                { id: "s2-l2-9", title: "س9: ما هي شمعة 'الرجل المشنوق' (Hanging Man)؟", content: "تبدو شمعة الرجل المشنوق مطابقة للمطرقة ولكنها تظهر في قمة اتجاه صاعد. إنها إشارة انعكاس هبوطية، تشير إلى أن ضغط البيع بدأ في الظهور." },
                { id: "s2-l2-10", title: "س10: لماذا تعتبر شمعة الرجل المشنوق هبوطية إذا كانت تشبه المطرقة الصعودية؟", content: "السياق هو المفتاح. في قمة اتجاه صاعد، يظهر الفتيل السفلي الطويل حدوث بيع كبير خلال الفترة، على الرغم من أن المشترين تمكنوا من دفعه للأعلى مرة أخرى. إنه تحذير بأن البائعين يختبرون السوق." },
                { id: "s2-l2-11", title: "س11: ما هي 'المطرقة المقلوبة' (Inverted Hammer)؟", content: "المطرقة المقلوبة هي نمط انعكاس صعودي يوجد في قاع اتجاه هابط. تبدو مثل مطرقة مقلوبة: جسم صغير في الأسفل، فتيل علوي طويل، وقليل من الفتيل السفلي أو لا يوجد." },
                { id: "s2-l2-12", title: "س12: ما هي نفسية المطرقة المقلوبة؟", content: "تظهر أن المشترين حاولوا رفع السعر، لكن البائعين دفعوه للأسفل مرة أخرى. ومع ذلك، فإن حقيقة أن المشترين أظهروا هذه القوة بعد اتجاه هابط هي إشارة محتملة على أن البائعين يفقدون الزخم." },
                { id: "s2-l2-13", title: "س13: ما هي 'النجم الساقط' (Shooting Star)؟", content: "تبدو النجم الساقط مطابقة للمطرقة المقلوبة ولكنها تظهر في قمة اتجاه صاعد. إنها نمط انعكاس هبوطي قوي." },
                { id: "s2-l2-14", title: "س14: ما هي النفسية وراء النجم الساقط؟", content: "في ذروة اتجاه صاعد، يدفع المشترون السعر للأعلى، لكن البائعين يتدخلون بقوة ساحقة، ويدفعون السعر للأسفل ليغلق بالقرب من الافتتاح. هذا يشير إلى أن الاتجاه الصاعد قد يكون قد انتهى." },
                { id: "s2-l2-15", title: "س15: ما هي شمعة 'ماروبوزو' (Marubozu)؟", content: "الماروبوزو هي شمعة بجسم كامل وبدون فتائل على الإطلاق. الماروبوزو الخضراء صعودية للغاية (كان المشترون مسيطرين من الافتتاح إلى الإغلاق). الماروبوزو الحمراء هبوطية للغاية (كان البائعون مسيطرين)." },
                { id: "s2-l2-16", title: "س16: هل لون جسم المطرقة مهم؟", content: "تعتبر المطرقة الخضراء (حيث يكون الإغلاق فوق الافتتاح) أكثر صعودية بقليل من المطرقة الحمراء، لكن كلاهما إشارات انعكاس صالحة. الشكل أهم من اللون." },
                { id: "s2-l2-17", title: "س17: هل لون جسم النجم الساقط مهم؟", content: "يعتبر النجم الساقط الأحمر (حيث يكون الإغلاق تحت الافتتاح) أكثر هبوطية بقليل من الأخضر، ولكن مرة أخرى، كلاهما إشارات هبوطية صالحة. الفتيل العلوي الطويل هو الميزة الرئيسية." },
                { id: "s2-l2-18", title: "س18: ما هو 'التأكيد' في تداول الشموع؟", content: "التأكيد هو عندما تتحرك الشمعة التالية بعد إشارة النمط في الاتجاه المتوقع. على سبيل المثال، بعد شمعة المطرقة، يكون التأكيد هو إغلاق الشمعة التالية على ارتفاع." },
                { id: "s2-l2-19", title: "س19: هل أنماط الشمعة الواحدة موثوقة بمفردها؟", content: "تكون أكثر موثوقية عندما تظهر عند مستوى فني مهم، مثل منطقة دعم/مقاومة رئيسية، أو خط اتجاه، أو متوسط متحرك رئيسي. السياق هو كل شيء." },
                { id: "s2-l2-20", title: "س20: ما الفرق الرئيسي بين الدوجي والقمة الدوارة؟", content: "كلاهما يشير إلى التردد. الفرق البصري الرئيسي هو أن الدوجي له خط كجسم (الافتتاح والإغلاق متطابقان تقريبًا)، بينما القمة الدوارة لها جسم مستطيل قصير ولكنه مرئي." }
            ]
          },
          { 
            id: "s2-l3", 
            title: "الدرس 3: أنماط الشموع المزدوجة", 
            subLessons: [
              { id: "s2-l3-1", title: "س1: ما هو نمط الشموع المزدوجة؟", content: "نمط الشموع المزدوجة هو إشارة تتكون من شمعتين متتاليتين، وعند قراءتهما معًا، تقدمان إشارة أقوى لانعكاس أو استمرار محتمل للسوق مما يمكن أن تقدمه شمعة واحدة." },
              { id: "s2-l3-2", title: "س2: ما هو نمط 'الابتلاع الصاعد' (Bullish Engulfing)؟", content: "يحدث نمط الابتلاع الصاعد في قاع اتجاه هابط. يتكون من شمعة هابطة صغيرة تليها شمعة صاعدة أكبر 'تبتلع' جسم الشمعة السابقة بالكامل. إنها إشارة انعكاس قوية." },
              { id: "s2-l3-3", title: "س3: ما هي النفسية وراء نمط الابتلاع الصاعد؟", content: "تُظهر الشمعة الأولى أن البائعين مسيطرون. الشمعة الثانية الأكبر تظهر أن المشترين تدخلوا بقوة ساحقة، ليس فقط لمحو تقدم البائعين ولكن أيضًا للإغلاق أعلى بكثير، مما يشير إلى تحول قوي في الزخم." },
              { id: "s2-l3-4", title: "س4: ما هو نمط 'الابتلاع الهابط' (Bearish Engulfing)؟", content: "يحدث نمط الابتلاع الهابط في قمة اتجاه صاعد. إنه عكس النسخة الصاعدة: شمعة صاعدة صغيرة تليها شمعة هابطة أكبر تبتلع جسم الشمعة السابقة بالكامل. إنها إشارة انعكاس هبوطية قوية." },
              { id: "s2-l3-5", title: "س5: ما هو نمط 'الملقط السفلي' (Tweezer Bottom)؟", content: "الملقط السفلي هو نمط انعكاس صعودي. يتكون من شمعتين متتاليتين لهما قيعان متطابقة تقريبًا. الشمعة الأولى هابطة، والثانية صاعدة، مما يدل على أن السوق رفض مستوى السعر الأدنى." },
              { id: "s2-l3-6", title: "س6: ما هو نمط 'الملقط العلوي' (Tweezer Top)؟", content: "الملقط العلوي هو نمط انعكاس هبوطي. يتكون من شمعتين متتاليتين لهما قمم متطابقة تقريبًا. الشمعة الأولى صاعدة، والثانية هابطة، مما يشير إلى أن السوق رفض مستوى السعر الأعلى." },
              { id: "s2-l3-7", title: "س7: ما هو نمط 'خط الثقب' (Piercing Line)؟", content: "خط الثقب هو نمط انعكاس صعودي يوجد بعد اتجاه هابط. إنه نمط من شمعتين: الأولى شمعة هابطة قوية، والثانية شمعة صاعدة تفتح تحت قاع الشمعة الأولى ولكنها تغلق فوق منتصف جسم الشمعة الأولى." },
              { id: "s2-l3-8", title: "س8: ماذا يعني نمط خط الثقب؟", content: "إنه يدل على قاع محتمل. الفجوة السعرية لأسفل عند افتتاح الشمعة الثانية تظهر ضغط بيع قوي، لكن الارتفاع القوي للإغلاق في عمق جسم الشمعة السابقة يظهر أن المشترين قد سيطروا بشكل كبير." },
              { id: "s2-l3-9", title: "س9: ما هو نمط 'السحابة القاتمة' (Dark Cloud Cover)؟", content: "السحابة القاتمة هي النظير الهبوطي لخط الثقب وتحدث بعد اتجاه صاعد. الشمعة الأولى هي شمعة صاعدة قوية. الشمعة الثانية هابطة، تفتح فوق قمة الأولى، ولكنها تغلق تحت منتصف جسم الشمعة الأولى." },
              { id: "s2-l3-10", title: "س10: لماذا تعتبر الأنماط المزدوجة أكثر موثوقية بشكل عام من الأنماط الفردية؟", content: "توفر الأنماط المزدوجة مزيدًا من المعلومات حول سلوك السوق على مدى فترتين. يمكن أن تظهر صراعًا أكثر تحديدًا وتحولًا أوضح في القوة بين المشترين والبائعين، مما يضيف إلى موثوقية النمط." }
            ]
          },
          { 
            id: "s2-l4", 
            title: "الدرس 4: أنماط الشموع الثلاثية", 
            subLessons: [
              { id: "s2-l4-1", title: "س1: ما هو نمط الشموع الثلاثية؟", content: "نمط الشموع الثلاثية هو إشارة تتكون من ثلاث شموع متتالية. تعتبر هذه الأنماط بشكل عام من أكثر إشارات الشموع موثوقية لأنها تمثل ثلاث جلسات كاملة من سيكولوجية السوق." },
              { id: "s2-l4-2", title: "س2: ما هو نمط 'نجمة الصباح' (Morning Star)؟", content: "نجمة الصباح هي نمط انعكاس صعودي قوي يحدث في قاع اتجاه هابط. يتكون من ثلاث شموع: 1) شمعة هابطة كبيرة، 2) شمعة صغيرة الجسم (مثل دوجي أو قمة دوارة) تفتح بفجوة لأسفل، و 3) شمعة صاعدة كبيرة تغلق على الأقل في منتصف جسم الشمعة الأولى." },
              { id: "s2-l4-3", title: "س3: ما هي النفسية وراء نجمة الصباح؟", content: "إنها تظهر انتقالًا واضحًا: البائعون في سيطرة كاملة (الشمعة 1)، ثم هناك لحظة من التردد التام وتوقف محتمل في الزخم (الشمعة 2)، تليها سيطرة حاسمة للمشترين (الشمعة 3)." },
              { id: "s2-l4-4", title: "س4: ما هو نمط 'نجمة المساء' (Evening Star)؟", content: "نجمة المساء هي النظير الهبوطي لنجمة الصباح وتشير إلى قمة محتملة. تظهر بعد اتجاه صاعد وتتكون من: 1) شمعة صاعدة كبيرة، 2) شمعة صغيرة الجسم تفتح بفجوة لأعلى، و 3) شمعة هابطة كبيرة تغلق على الأقل في منتصف جسم الشمعة الأولى." },
              { id: "s2-l4-5", title: "س5: ما هي 'الجنود البيض الثلاثة' (Three White Soldiers)؟", content: "هذا نمط انعكاس أو استمرار صعودي قوي. يتكون من ثلاث شموع صاعدة طويلة متتالية، كل منها يغلق أعلى من سابقتها. من الناحية المثالية، تفتح كل شمعة داخل جسم الشمعة السابقة." },
              { id: "s2-l4-6", title: "س6: ماذا تعني الجنود البيض الثلاثة؟", content: "إنها تعني تقدمًا ثابتًا وقويًا من قبل المشترين. يشير عدم وجود ظلال طويلة على الشموع إلى أن المشترين كانوا مسيطرين من الافتتاح إلى الإغلاق لثلاث فترات متتالية." },
              { id: "s2-l4-7", title: "س7: ما هي 'الغربان السود الثلاثة' (Three Black Crows)؟", content: "هذا هو النظير الهبوطي للجنود البيض الثلاثة. يتكون من ثلاث شموع هابطة طويلة متتالية، كل منها يغلق أدنى من سابقتها. إنها إشارة انعكاس أو استمرار هبوطية قوية." },
              { id: "s2-l4-8", title: "س8: ما هو نمط 'الثلاثة الصاعدون للداخل' (Three Inside Up)؟", content: "هذا نمط انعكاس صعودي. يبدأ بشمعة هابطة كبيرة. الشمعة الثانية هي شمعة صاعدة صغيرة محتواة داخل جسم الأولى. الشمعة الثالثة هي شمعة صاعدة تغلق فوق قمة الشمعة الأولى، مؤكدة الانعكاس." },
              { id: "s2-l4-9", title: "س9: ما هو نمط 'الثلاثة الهابطون للداخل' (Three Inside Down)؟", content: "هذا نمط انعكاس هبوطي. يبدأ بشمعة صاعدة كبيرة. الشمعة الثانية هي شمعة هابطة صغيرة محتواة داخل جسم الشمعة الأولى. الشمعة الثالثة هي شمعة هابطة تغلق تحت قاع الشمعة الأولى، مؤكدة الانعكاس الهبوطي." },
              { id: "s2-l4-10", title: "س10: أين تكون أنماط الشموع الثلاثية أكثر فعالية؟", content: "مثل جميع أنماط الشموع، تكون أكثر موثوقية وفعالية عندما تتشكل عند مستوى فني مهم، مثل منطقة دعم أو مقاومة رئيسية، أو مستوى فيبوناتشي رئيسي، أو خط اتجاه طويل الأجل." }
            ]
          },
          { 
            id: "s2-l5", 
            title: "الدرس 5: تحديد الدعم والمقاومة", 
            subLessons: [
              { id: "s2-l5-1", title: "س1: ما هو مستوى الدعم؟", content: "مستوى الدعم هو نقطة سعر على الرسم البياني حيث يكون اهتمام الشراء قويًا تاريخيًا بما يكفي للتغلب على ضغط البيع. إنه يعمل بمثابة 'أرضية' تمنع السعر من الانخفاض أكثر." },
              { id: "s2-l5-2", title: "س2: ما هو مستوى المقاومة؟", content: "مستوى المقاومة هو نقطة سعر حيث يكون ضغط البيع قويًا تاريخيًا بما يكفي للتغلب على اهتمام الشراء. إنه يعمل بمثابة 'سقف' يمنع السعر من الارتفاع أكثر." },
              { id: "s2-l5-3", title: "س3: كيف تحدد مستوى دعم محتمل؟", content: "ابحث عن القيعان المتأرجحة السابقة على الرسم البياني. يمكن رسم خط أفقي يربط بين عدة نقاط منخفضة. كلما لمس السعر هذا المستوى وارتد عنه مرات أكثر، كلما اعتبر أقوى." },
              { id: "s2-l5-4", title: "س4: كيف تحدد مستوى مقاومة محتمل؟", content: "ابحث عن القمم المتأرجحة السابقة على الرسم البياني. خط أفقي يربط بين عدة نقاط مرتفعة يشير إلى مستوى مقاومة. كلما زادت عمليات الرفض من هذا المستوى، كلما كان أقوى." },
              { id: "s2-l5-5", title: "س5: ما هو مبدأ 'تبادل الأدوار'؟", content: "هذا مفهوم أساسي حيث يمكن لمستوى دعم مكسور أن يصبح مستوى مقاومة جديدًا، ومستوى مقاومة مكسور يمكن أن يصبح مستوى دعم جديدًا. يُعرف هذا أيضًا بمنطقة 'القلب' (flip zone)." },
              { id: "s2-l5-6", title: "س6: لماذا يحدث تبادل الأدوار؟", content: "يعتمد على سيكولوجية السوق. عندما ينكسر مستوى الدعم، يكون المشترون الذين اشتروا عند هذا المستوى الآن في وضع خاسر. قد يتطلعون إلى البيع عند سعر دخولهم (الدعم القديم) إذا عاد السعر، مما يخلق مقاومة جديدة." },
              { id: "s2-l5-7", title: "س7: هل الدعم والمقاومة نقاط سعر واحدة أم مناطق؟", content: "من الأفضل التفكير فيها كمناطق بدلاً من خطوط دقيقة. قد لا يتوقف السعر عند نفس السعر الدقيق في كل مرة، لذا فإن رسم 'صندوق' أو 'منطقة' صغيرة غالبًا ما يكون أكثر عملية." },
              { id: "s2-l5-8", title: "س8: كيف يؤثر الإطار الزمني على الدعم والمقاومة؟", content: "المستويات المحددة على الأطر الزمنية الأعلى (مثل اليومي أو الأسبوعي) أكثر أهمية وقوة بكثير من المستويات المحددة على الأطر الزمنية المنخفضة (مثل 15 دقيقة أو ساعة واحدة)." },
              { id: "s2-l5-9", title: "س9: ما هي الأدوات الأخرى التي يمكن أن تساعد في تحديد الدعم والمقاومة؟", content: "إلى جانب الخطوط الأفقية، تشمل الأدوات الأخرى: خطوط الاتجاه، القنوات، المتوسطات المتحركة (الدعم/المقاومة الديناميكية)، مستويات تصحيح فيبوناتشي، ونقاط البيفوت." },
              { id: "s2-l5-10", title: "س10: ماذا يعني 'اختراق' المستوى؟", content: "يحدث الاختراق عندما يتحرك السعر بشكل حاسم عبر مستوى دعم أو مقاومة ويغلق خلفه. الاختراق فوق المقاومة إشارة صعودية، بينما الاختراق تحت الدعم إشارة هبوطية." }
            ]
          },
          { 
            id: "s2-l6", 
            title: "الدرس 6: خطوط الاتجاه والقنوات", 
            subLessons: [
              { id: "s2-l6-1", title: "س1: ما هو خط الاتجاه؟", content: "خط الاتجاه هو خط مستقيم يتم رسمه على الرسم البياني يربط سلسلة من نقاط السعر لتحديد اتجاه وقوة الاتجاه." },
              { id: "s2-l6-2", title: "س2: كيف ترسم خط اتجاه صاعد؟", content: "يتم رسم خط الاتجاه الصاعد عن طريق ربط ما لا يقل عن قاعين متأرجحين مهمين. يجب أن يكون للخط ميل إيجابي، ويجب أن تكون حركة السعر فوق الخط." },
              { id: "s2-l6-3", title: "س3: كيف ترسم خط اتجاه هابط؟", content: "يتم رسم خط الاتجاه الهابط عن طريق ربط ما لا يقل عن قمتين متأرجحتين مهمتين. يجب أن يكون للخط ميل سلبي، ويجب أن تكون حركة السعر تحت الخط." },
              { id: "s2-l6-4", title: "س4: كم عدد 'اللمسات' التي تجعل خط الاتجاه صالحًا؟", content: "يتطلب خط الاتجاه نقطتين على الأقل لرسمه. ومع ذلك، فإن اللمسة الثالثة للخط هي التي تصادق عليه وتجعله مستوى فنيًا مهمًا للمراقبة." },
              { id: "s2-l6-5", title: "س5: كيف تستخدم خطوط الاتجاه في التداول؟", content: "يستخدم المتداولون خطوط الاتجاه كدعم ديناميكي (في اتجاه صاعد) أو مقاومة ديناميكية (في اتجاه هابط). قد يتطلعون للشراء عندما يتراجع السعر إلى خط اتجاه صاعد أو البيع عندما يرتفع السعر إلى خط اتجاه هابط." },
              { id: "s2-l6-6", title: "س6: ماذا يعني عندما 'ينكسر' خط الاتجاه؟", content: "يحدث كسر خط الاتجاه عندما يغلق السعر بشكل حاسم على الجانب الآخر من الخط. كسر خط الاتجاه الصاعد إشارة هبوطية محتملة، وكسر خط الاتجاه الهابط إشارة صعودية محتملة." },
              { id: "s2-l6-7", title: "س7: ما هي قناة السعر؟", content: "يتم إنشاء قناة السعر (أو قناة الاتجاه) عن طريق رسم خط ثانٍ موازٍ لخط اتجاه موجود. في الاتجاه الصاعد، يربط هذا الخط الموازي القمم المتأرجحة. في الاتجاه الهابط، يربط القيعان المتأرجحة." },
              { id: "s2-l6-8", title: "س8: ماذا تظهر قناة السعر؟", content: "تحتوي القناة على غالبية حركة السعر ويمكن أن تساعد في تحديد ظروف التشبع الشرائي (في الجزء العلوي من القناة) والتشبع البيعي (في الجزء السفلي من القناة) داخل الاتجاه." },
              { id: "s2-l6-9", title: "س9: هل يجب عليك تعديل خط الاتجاه إذا تم كسره قليلاً؟", content: "أحيانًا. إذا اخترق السعر الخط لفترة وجيزة ولكنه لم يغلق بشكل حاسم خلفه، يقوم بعض المتداولين بتعديل الخط ليناسب حركة السعر الأخيرة بشكل أفضل. ومع ذلك، يمكن أن تلغي التعديلات المتكررة الغرض منه." },
              { id: "s2-l6-10", title: "س10: هل انحدار (زاوية) خط الاتجاه مهم؟", content: "نعم. غالبًا ما يكون خط الاتجاه شديد الانحدار غير مستدام ومن المرجح أن يتم كسره قريبًا. غالبًا ما تشير الزاوية الأكثر اعتدالًا (حوالي 30-45 درجة) إلى اتجاه أكثر صحة واستدامة." }
            ]
          },
          { id: "s2-l7", title: "الدرس 7: أنماط الرسوم البيانية الجزء 1 - الأنماط الانعكاسية", content: "تعلم رصد الأنماط الانعكاسية الرئيسية مثل الرأس والكتفين (Head and Shoulders)، والرأس والكتفين المقلوب، والقمم/القيعان المزدوجة/الثلاثية." },
          { id: "s2-l8", title: "الدرس 8: أنماط الرسوم البيانية الجزء 2 - الأنماط الاستمرارية", content: "حدد الأنماط التي تشير إلى أن الاتجاه الحالي سيستمر، مثل المثلثات (المتماثلة، الصاعدة، الهابطة)، والأعلام (Flags)، والرايات (Pennants)." },
          { id: "s2-l9", title: "الدرس 9: مقدمة في المؤشرات الفنية", content: "افهم الفرق بين المؤشرات الرائدة (leading) والمؤشرات المتأخرة (lagging) وكيف يمكن استخدامها لتأكيد حركة السعر، وليس للتنبؤ بها." },
          { id: "s2-l10", title: "الدرس 10: المتوسطات المتحركة (MA)", content: "تعرف على المتوسطات المتحركة البسيطة (SMA) والأسية (EMA). افهم كيف يمكن استخدامها لتحديد اتجاه الاتجاه وكدعم/مقاومة ديناميكية." },
          { id: "s2-l11", title: "الدرس 11: تقاطعات المتوسطات المتحركة", content: "اكتشف مفهوم 'التقاطع الذهبي' (مثل تقاطع EMA 50 فوق EMA 200) و'تقاطع الموت' كإشارات اتجاه طويلة الأجل." },
          { id: "s2-l12", title: "الدرس 12: مؤشر القوة النسبية (RSI)", content: "تعلم كيفية استخدام مؤشر القوة النسبية لتحديد حالات التشبع الشرائي (&gt;70) والتشبع البيعي (&lt;30). تعلم أيضًا المفهوم القوي للتباعد (divergence) في RSI." },
          { id: "s2-l13", title: "الدرس 13: مؤشر تقارب وتباعد المتوسطات المتحركة (MACD)", content: "افهم مكونات MACD (خط MACD، خط الإشارة، المدرج التكراري) وكيفية استخدام التقاطعات والمدرج التكراري لقياس الزخم." },
          { id: "s2-l14", title: "الدرس 14: نطاقات بولينجر (Bollinger Bands)", content: "تعلم كيف تمثل النطاقات الثلاثة (العلوي، الأوسط، السفلي) التقلبات. افهم مفاهيم مثل 'الانضغاط' وكيف تتفاعل الأسعار مع النطاقات الخارجية." },
          { id: "s2-l15", title: "الدرس 15: تصحيح فيبوناتشي", content: "اكتشف كيفية استخدام أداة فيبوناتشي لتحديد مستويات الدعم والمقاومة المحتملة بعد حركة سعرية كبيرة. تشمل المستويات الرئيسية 38.2%، 50%، و 61.8%." },
          { id: "s2-l16", title: "الدرس 16: مذبذب ستوكاستيك", content: "على غرار RSI، تعلم كيف يمكن لمذبذب ستوكاستيك تحديد حالات التشبع الشرائي (&gt;80) والتشبع البيعي (&lt;20) من خلال مقارنة سعر الإغلاق بنطاق سعره خلال فترة معينة." },
          { id: "s2-l17", title: "الدرس 17: مقدمة في إدارة المخاطر", content: "أهم موضوع على الإطلاق. افهم أن وظيفتك الأساسية كمتداول هي إدارة المخاطر، وليس أن تكون على صواب طوال الوقت." },
          { id: "s2-l18", title: "الدرس 18: تحديد وقف الخسارة", content: "تعلم طرقًا مختلفة لوضع وقف الخسارة: بناءً على مستوى رئيسي، أو نسبة مئوية من حسابك، أو التقلبات (باستخدام ATR على سبيل المثال)." },
          { id: "s2-l19", title: "الدرس 19: حساب حجم المركز", content: "تعلم الصيغة لتحديد حجم العقد الصحيح لأي صفقة بناءً على حجم حسابك، ونسبة المخاطرة، ومسافة وقف الخسارة. هذا أمر حاسم للحفاظ على رأس المال." },
          { id: "s2-l20", title: "الدرس 20: نسبة المخاطرة إلى العائد", content: "افهم كيفية حساب واستخدام نسبة المخاطرة إلى العائد. استهدف الصفقات التي يكون فيها الربح المحتمل على الأقل ضعف الخسارة المحتملة (على سبيل المثال، 1:2 R:R)." },
          { id: "s2-l21", title: "الدرس 21: مقدمة في التحليل الأساسي", content: "تعلم كيف يمكن للأخبار الاقتصادية الرئيسية، مثل قرارات أسعار الفائدة والناتج المحلي الإجمالي وبيانات التوظيف (مثل NFP)، أن تؤثر بشكل كبير على أسعار العملات." },
        ]
      },
      {
        stage: "المرحلة الثالثة: تقنيات متقدمة",
        icon: 'BrainCircuit',
        description: "أتقن الجوانب النفسية وإدارة المخاطر في التداول لتحقيق الاستمرارية.",
        lessons: [
          {
            id: "lesson-10",
            title: "الدرس 10: إدارة المخاطر المتقدمة",
            content: "نفذ استراتيجيات مثل قاعدة 1% (لا تخاطر أبدًا بأكثر من 1% من حسابك في صفقة واحدة)، واستخدام نقاط الوقف المتحركة (trailing stops) لتأمين الأرباح، وحساب حجم المركز بناءً على التقلبات ومسافة وقف الخسارة."
          },
        ]
      }
    ]
  },
  es: {
    pageTitle: "Ruta de Aprendizaje de Aura",
    pageDescription: "Un plan de estudios completo para llevarte de novato a un trader disciplinado. Sigue las etapas en orden.",
    finalExamCard: {
      title: "Examen Final: Pon a Prueba Tus Conocimientos",
      description: "Después de completar todas las lecciones, realiza el examen final para evaluar tu comprensión e identificar tu nivel de trading.",
      buttonText: "Completa Todas las Lecciones para Desbloquear",
      buttonTextActive: "Iniciar Examen Final",
      dialogTitle: "Condiciones del Examen Final",
      dialogDescription: "Estás a punto de comenzar el examen final. Esta es una prueba cronometrada con 10 preguntas. Debes responder a todas las preguntas para ver tu resultado. ¿Estás listo para continuar?",
      dialogAction: "Proceder al Examen",
      dialogCancel: "Cancelar",
    },
    markAsRead: "Marcar como leído",
    lessonLocked: "Completa la lección anterior para desbloquear",
    stages: [
      {
        stage: "Etapa 1: Fundamentos para Principiantes",
        icon: 'Star',
        description: "Comienza tu viaje aquí. Estas lecciones cubren los elementos esenciales del trading de Forex.",
        lessons: [
            {
                id: "lesson-1",
                title: "Lección 1: Introducción al Mercado Forex",
                subLessons: [
                    { id: "1-1", title: "P1: ¿Qué es el Mercado Forex?", content: "El mercado de divisas (Forex) es un mercado global y descentralizado donde se negocian divisas. Es el mercado financiero más grande y líquido del mundo, donde los participantes compran, venden e intercambian divisas a precios determinados." },
                    { id: "1-2", title: "P2: ¿Cómo funciona el trading de Forex?", content: "Forex se negocia en pares de divisas (p. ej., EUR/USD). Cuando operas, especulas sobre si el valor de una divisa subirá o bajará frente a otra. Siempre estás comprando simultáneamente una divisa y vendiendo la otra." },
                    { id: "1-3", title: "P3: ¿Cuáles son las principales sesiones en el mercado Forex?", content: "El mercado opera 24 horas al día, cinco días a la semana, a través de cuatro sesiones de negociación principales: Sídney, Tokio, Londres y Nueva York. La superposición de estas sesiones, especialmente Londres y Nueva York, a menudo tiene el mayor volumen de operaciones." },
                    { id: "1-4", title: "P4: ¿Quiénes son los principales participantes en el mercado Forex?", content: "Los participantes principales incluyen bancos centrales, grandes bancos comerciales y de inversión (el mercado interbancario), fondos de cobertura, corporaciones y traders minoristas (inversores individuales)." },
                    { id: "1-5", title: "P5: ¿Qué son los pares de divisas 'Mayores'?", content: "Los pares mayores son los más negociados del mundo. Todos involucran al dólar estadounidense (USD) y son conocidos por su alta liquidez. Ejemplos incluyen EUR/USD, GBP/USD y USD/JPY." },
                    { id: "1-6", title: "P6: ¿Qué son los pares de divisas 'Menores' o 'Cruzados'?", content: "Los pares menores, o pares de divisas cruzados, son pares que no involucran al dólar estadounidense. Consisten en otras divisas principales, como EUR/GBP, EUR/JPY o GBP/AUD." },
                    { id: "1-7", title: "P7: ¿Qué son los pares de divisas 'Exóticos'?", content: "Los pares exóticos consisten en una divisa principal emparejada con la divisa de una economía emergente. Ejemplos incluyen USD/TRY (Dólar estadounidense/Lira turca) o EUR/MXN (Euro/Peso mexicano). Son menos líquidos y tienen spreads más amplios." },
                    { id: "1-8", title: "P8: ¿Qué significa que un mercado sea 'descentralizado'?", content: "Un mercado descentralizado, como Forex, no tiene una ubicación física central o una bolsa. La negociación se realiza electrónicamente 'over-the-counter' (OTC), lo que significa que todas las transacciones ocurren a través de redes informáticas entre traders de todo el mundo." },
                    { id: "1-9", title: "P9: ¿Cómo se lee una cotización de Forex como EUR/USD = 1.0850?", content: "La primera divisa (EUR) es la divisa 'base', y la segunda (USD) es la divisa 'cotizada'. La cotización significa que 1 euro vale 1.0850 dólares estadounidenses. La divisa base siempre tiene un valor de 1." },
                    { id: "1-10", title: "P10: ¿Cuál es la diferencia entre comprar y vender un par?", content: "Si 'compras' EUR/USD, estás comprando euros y vendiendo dólares estadounidenses, especulando que el euro se fortalecerá. Si 'vendes' EUR/USD, estás vendiendo euros y comprando dólares estadounidenses, especulando que el euro se debilitará." },
                    { id: "1-11", title: "P11: ¿Qué impulsa el mercado Forex?", content: "El mercado es impulsado por una combinación de factores, que incluyen tasas de interés, inflación, estabilidad política, desempeño económico y especulación. Estos factores influyen en la oferta y la demanda de las divisas." },
                    { id: "1-12", title: "P12: ¿Qué es la 'liquidez' en Forex?", content: "La liquidez se refiere a la capacidad de comprar o vender un par de divisas sin causar un cambio significativo en su tipo de cambio. El mercado Forex es extremadamente líquido, lo que significa que se pueden ejecutar grandes órdenes fácilmente y los spreads suelen ser ajustados, especialmente para los pares mayores." },
                    { id: "1-13", title: "P13: ¿Está regulado el mercado Forex?", content: "Aunque el mercado es descentralizado, organismos reguladores en diferentes países supervisan a los brokers de Forex para garantizar un comportamiento justo y ético. Ejemplos incluyen la FCA en el Reino Unido y ASIC en Australia." },
                    { id: "1-14", title: "P14: ¿Qué es un 'bróker' en Forex?", content: "Un bróker de Forex es una empresa de servicios financieros que proporciona a los traders acceso a una plataforma para comprar y vender divisas extranjeras. Los traders minoristas necesitan un bróker para participar en el mercado." },
                    { id: "1-15", title: "P15: ¿Cuáles son las ventajas de operar en Forex?", content: "Las ventajas incluyen alta liquidez, acceso al mercado las 24 horas, la capacidad de operar con apalancamiento y el potencial de beneficiarse tanto de los mercados alcistas como bajistas." },
                    { id: "1-16", title: "P16: ¿Cuáles son los riesgos de operar en Forex?", content: "Los riesgos principales incluyen el potencial de pérdidas significativas debido al apalancamiento, la volatilidad del mercado y la naturaleza compleja de los factores económicos globales. La gestión de riesgos es crucial." },
                    { id: "1-17", title: "P17: ¿Qué es el 'Mercado Interbancario'?", content: "El mercado interbancario es la red global utilizada por las instituciones financieras para negociar divisas entre sí. Operan directamente, y este mercado establece los precios que luego se ofrecen a los traders minoristas." },
                    { id: "1-18", title: "P18: ¿Qué es un 'par de divisas'?", content: "Un par de divisas es la cotización de dos monedas diferentes, con el valor de una moneda cotizado frente a la otra. Por ejemplo, en GBP/USD, el valor de la libra esterlina se cotiza frente al dólar estadounidense." },
                    { id: "1-19", title: "P19: ¿Por qué es tan importante el dólar estadounidense en Forex?", content: "El USD es la principal moneda de reserva del mundo. Está involucrado en la mayoría del comercio global y está en un lado de la mayoría de las transacciones de Forex, lo que lo convierte en la moneda más negociada." },
                    { id: "1-20", title: "P20: ¿Se puede operar en Forex los fines de semana?", content: "No, el mercado minorista de Forex está cerrado los fines de semana. Cierra el viernes por la tarde (hora de Nueva York) y vuelve a abrir el domingo por la tarde (hora de Sídney). Los precios pueden 'saltar' (gap) durante el fin de semana si ocurren noticias importantes." }
                ]
            },
            {
                id: "lesson-2",
                title: "Lección 2: Terminología Clave",
                subLessons: [
                    { id: "2-1", title: "P1: ¿Qué es un 'Pip'?", content: "Un 'Pip' (Percentage in Point) es una unidad estandarizada y es la cantidad más pequeña en la que puede cambiar una cotización de divisa. Para la mayoría de los pares de divisas, un pip es un cambio en el 4º decimal (p. ej., 0.0001)." },
                    { id: "2-2", title: "P2: ¿Qué es un 'Pipette'?", content: "Un 'Pipette' representa una fracción de un pip. Es el 5º decimal en la mayoría de las cotizaciones de divisas (p. ej., 0.00001). Permite una fijación de precios más precisa." },
                    { id: "2-3", title: "P3: ¿Qué es el precio 'Bid'?", content: "El precio 'Bid' es el precio al que un bróker está dispuesto a comprarte la divisa base. Es el precio al que tú, el trader, puedes 'vender' el par." },
                    { id: "2-4", title: "P4: ¿Qué es el precio 'Ask'?", content: "El precio 'Ask' es el precio al que un bróker está dispuesto a venderte la divisa base. Es el precio al que tú, el trader, puedes 'comprar' el par. El precio de venta siempre es ligeramente superior al precio de compra." },
                    { id: "2-5", title: "P5: ¿Qué es el 'Spread'?", content: "El spread es la diferencia entre el precio de venta (ask) y el precio de compra (bid). Esta es la forma principal en que los brokers de Forex ganan dinero. Un spread más pequeño es más favorable para el trader." },
                    { id: "2-6", title: "P6: ¿Qué es el 'Apalancamiento'?", content: "El apalancamiento es una herramienta proporcionada por los brokers que permite a los traders controlar una posición grande en el mercado con una cantidad relativamente pequeña de su propio capital. Por ejemplo, un apalancamiento de 100:1 significa que puedes controlar una posición de $100,000 con solo $1,000." },
                    { id: "2-7", title: "P7: ¿Qué es el 'Margen'?", content: "El margen es la cantidad de dinero requerida en tu cuenta para abrir y mantener una posición apalancada. No es una tarifa, sino una porción del capital de tu cuenta reservada como depósito. Por ejemplo, con un apalancamiento de 100:1, el margen para una posición de $100,000 es de $1,000." },
                    { id: "2-8", title: "P8: ¿Qué es una 'Llamada de Margen' (Margin Call)?", content: "Una llamada de margen ocurre cuando el capital de tu cuenta cae por debajo del nivel de margen requerido para mantener tus posiciones abiertas. El bróker te pedirá que deposites más fondos o cerrará algunas/todas tus posiciones para cubrir tus pérdidas." },
                    { id: "2-9", title: "P9: ¿Qué es un 'Lote'?", content: "Un lote es una unidad de medida para el tamaño de una transacción. Un 'Lote Estándar' es de 100,000 unidades de la divisa base. Este es el tamaño estándar de un contrato de trading." },
                    { id: "2-10", title: "P10: ¿Qué son los 'Mini' y 'Micro' Lotes?", content: "Un 'Mini Lote' es de 10,000 unidades de la divisa base (0.1 de un lote estándar). Un 'Micro Lote' es de 1,000 unidades (0.01 de un lote estándar). Estos tamaños de lote más pequeños permiten a los traders con menos capital participar en el mercado y gestionar el riesgo." },
                    { id: "2-11", title: "P11: ¿Qué significa 'Largo' (Long) y 'Corto' (Short)?", content: "Ir 'largo' significa que estás comprando un par de divisas, esperando que su valor aumente. Ir 'corto' significa que estás vendiendo un par de divisas, esperando que su valor disminuya." },
                    { id: "2-12", title: "P12: ¿Qué es el 'Deslizamiento' (Slippage)?", content: "El deslizamiento ocurre cuando una operación se ejecuta a un precio diferente al solicitado. Esto suele suceder durante períodos de alta volatilidad o cuando se ejecuta una orden grande." },
                    { id: "2-13", title: "P13: ¿Qué es 'Alcista' (Bullish) vs 'Bajista' (Bearish)?", content: "Un mercado 'alcista' es aquel en el que los precios tienden al alza. Un mercado 'bajista' es aquel en el que los precios tienden a la baja. Un mercado alcista significa optimismo, mientras que un mercado bajista significa pesimismo." },
                    { id: "2-14", title: "P14: ¿Qué es la 'Volatilidad'?", content: "La volatilidad es una medida de la frecuencia y magnitud de los cambios de precios. Un mercado muy volátil experimenta grandes oscilaciones de precios, ofreciendo más potencial de ganancias pero también mayor riesgo." },
                    { id: "2-15", title: "P15: ¿Qué es una orden 'Take Profit' (TP)?", content: "Una orden Take Profit es una orden que colocas para cerrar automáticamente una operación rentable una vez que alcanza un cierto nivel de precios. Se utiliza para asegurar las ganancias." },
                    { id: "2-16", title: "P16: ¿Qué es una orden 'Stop-Loss' (SL)?", content: "Una orden Stop-Loss es una orden que colocas para cerrar automáticamente una operación perdedora una vez que alcanza un cierto nivel de precios. Es una herramienta crucial de gestión de riesgos para limitar las pérdidas potenciales." },
                    { id: "2-17", title: "P17: ¿Qué es una divisa 'Base'?", content: "La divisa base es la primera divisa en un par de divisas (p. ej., el EUR en EUR/USD). El tipo de cambio muestra cuánto de la divisa cotizada se necesita para comprar una unidad de la divisa base." },
                    { id: "2-18", title: "P18: ¿Qué es una divisa 'Cotizada'?", content: "La divisa cotizada es la segunda divisa en un par de divisas (p. ej., el USD en EUR/USD). Es la divisa en la que se valora la divisa base." },
                    { id: "2-19", title: "P19: ¿Qué es 'Rollover' o 'Swap'?", content: "El Rollover (o Swap) es el interés pagado o ganado por mantener una posición abierta durante la noche. Se basa en el diferencial de tasas de interés entre las dos divisas del par." },
                    { id: "2-20", title: "P20: ¿Qué es la 'Cobertura' (Hedging)?", content: "La cobertura es una estrategia utilizada para proteger una posición de un movimiento adverso. En Forex, podría implicar abrir una segunda posición en la dirección opuesta a tu operación inicial para limitar las pérdidas." }
                ]
            },
            {
                id: "lesson-3",
                title: "Lección 3: Tipos de Órdenes",
                subLessons: [
                    { id: "3-1", title: "P1: ¿Qué es una Orden de Mercado?", content: "Una Orden de Mercado es una instrucción a un bróker para ejecutar una operación inmediatamente al mejor precio disponible. Es la forma más rápida de entrar o salir del mercado." },
                    { id: "3-2", title: "P2: ¿Cuándo deberías usar una Orden de Mercado?", content: "Usa una Orden de Mercado cuando tu objetivo principal es entrar en una operación rápidamente, y te preocupa menos el precio exacto de entrada. Es común en mercados de rápido movimiento." },
                    { id: "3-3", title: "P3: ¿Qué es una Orden Límite?", content: "Una Orden Límite es una instrucción para ejecutar una operación a un precio específico o mejor. Esto te da control sobre tu precio de entrada o salida." },
                    { id: "3-4", title: "P4: ¿Qué es una orden 'Buy Limit'?", content: "Una orden Buy Limit se coloca por debajo del precio de mercado actual. La operación solo se ejecuta si el precio de mercado baja a tu precio límite especificado o inferior." },
                    { id: "3-5", title: "P5: ¿Qué es una orden 'Sell Limit'?", content: "Una orden Sell Limit se coloca por encima del precio de mercado actual. La operación solo se ejecuta si el precio de mercado sube a tu precio límite especificado o superior." },
                    { id: "3-6", title: "P6: ¿Qué es una Orden Stop (u Orden Stop-Entry)?", content: "Una Orden Stop es una instrucción para comprar o vender un par de divisas una vez que alcanza un cierto precio. A menudo se usa para operar rupturas (breakouts)." },
                    { id: "3-7", title: "P7: ¿Qué es una orden 'Buy Stop'?", content: "Una orden Buy Stop se coloca por encima del precio de mercado actual. Se ejecuta solo cuando el precio de mercado sube a ese nivel. Los traders la usan para comprar en una ruptura por encima de un nivel de resistencia." },
                    { id: "3-8", title: "P8: ¿Qué es una orden 'Sell Stop'?", content: "Una orden Sell Stop se coloca por debajo del precio de mercado actual. Se ejecuta solo cuando el precio de mercado cae a ese nivel. Los traders la usan para vender en una ruptura por debajo de un nivel de soporte." },
                    { id: "3-9", title: "P9: ¿Cuál es la diferencia entre una Orden Límite y una Orden Stop?", content: "Una Orden Límite se usa para entrar al mercado a un precio más favorable (comprar bajo, vender alto). Una Orden Stop se usa para entrar al mercado cuando gana impulso en una cierta dirección (comprar alto, vender bajo)." },
                    { id: "3-10", title: "P10: ¿Qué es una Orden Stop-Loss?", content: "Un Stop-Loss (SL) es una orden defensiva vinculada a tu operación abierta. Cierra automáticamente tu posición si el mercado se mueve en tu contra en una cantidad especificada, limitando así tu pérdida potencial." },
                    { id: "3-11", title: "P11: ¿Por qué es esencial una orden Stop-Loss?", content: "Es la herramienta de gestión de riesgos más importante. Protege tu capital de pérdidas significativas y elimina la emoción de la decisión de salir de una operación perdedora." },
                    { id: "3-12", title: "P12: ¿Qué es una Orden Take-Profit?", content: "Un Take-Profit (TP) es una orden vinculada a tu operación abierta. Cierra automáticamente tu posición cuando alcanza un nivel de beneficio especificado, asegurando tus ganancias." },
                    { id: "3-13", title: "P13: ¿Qué es una orden 'Trailing Stop'?", content: "Un Trailing Stop es un tipo de orden stop-loss que se mueve con el precio de una operación rentable. Se establece en un cierto porcentaje o cantidad de pips por debajo (para una operación larga) o por encima (para una corta) del precio de mercado, asegurando ganancias a medida que la operación se mueve a tu favor." },
                    { id: "3-14", title: "P14: ¿Qué es una orden Good 'Til Canceled (GTC)?", content: "Una orden GTC permanece activa en el mercado hasta que decidas cancelarla. La mayoría de las órdenes pendientes (Límite, Stop) son GTC por defecto." },
                    { id: "3-15", title: "P15: ¿Qué es una orden Good for the Day (GFD)?", content: "Una orden GFD permanece activa hasta el final del día de negociación. Si no se ejecuta al cierre del mercado, se cancela automáticamente." },
                    { id: "3-16", title: "P16: ¿Qué es una orden Order-Cancels-Order (OCO)?", content: "Una orden OCO combina dos órdenes pendientes (generalmente una Límite y una Stop). Si una de las órdenes se ejecuta, la otra se cancela automáticamente. Esto es útil para operar rangos o rupturas." },
                    { id: "3-17", title: "P17: ¿Cómo ejecuta un bróker las órdenes?", content: "Los brokers pueden ser 'Dealing Desk' (Market Makers) que toman el otro lado de tu operación, o 'No Dealing Desk' (ECN/STP) que pasan tus órdenes directamente al mercado interbancario." },
                    { id: "3-18", title: "P18: ¿Qué es el 'precio de entrada'?", content: "El precio de entrada es el precio al que se ejecuta tu operación y tu posición se abre oficialmente en el mercado." },
                    { id: "3-19", title: "P19: ¿Se pueden modificar las órdenes pendientes?", content: "Sí, casi siempre puedes modificar o cancelar una orden pendiente (como un Buy Limit o un Sell Stop) en cualquier momento antes de que se haya ejecutado." },
                    { id: "3-20", title: "P20: ¿Qué es un 'fill' (ejecución)?", content: "Un 'fill' es la ejecución de una orden. Un 'partial fill' (ejecución parcial) es cuando solo una parte de tu orden se ejecuta a un precio determinado." }
                ]
            },
            {
                id: "lesson-4",
                title: "Lección 4: Tipos de Análisis",
                subLessons: [
                    { id: "4-1", title: "P1: ¿Cuáles son los tres tipos principales de análisis de mercado?", content: "Los tres tipos principales son Análisis Técnico, Análisis Fundamental y Análisis Sentimental." },
                    { id: "4-2", title: "P2: ¿Qué es el Análisis Técnico?", content: "El Análisis Técnico implica pronosticar movimientos de precios futuros examinando datos de mercado pasados, principalmente precio y volumen. Utiliza gráficos e indicadores para identificar patrones y tendencias." },
                    { id: "4-3", title: "P3: ¿Cuál es la suposición central del Análisis Técnico?", content: "La suposición central es que toda la información conocida ya se refleja en el precio. Por lo tanto, estudiar la acción del precio es todo lo que se necesita para tomar decisiones de trading. La historia tiende a repetirse." },
                    { id: "4-4", title: "P4: ¿Qué herramientas se utilizan en el Análisis Técnico?", content: "Las herramientas incluyen patrones de gráficos (p. ej., cabeza y hombros), líneas de tendencia, niveles de soporte y resistencia, e indicadores técnicos (p. ej., Medias Móviles, RSI, MACD)." },
                    { id: "4-5", title: "P5: ¿Qué es el Análisis Fundamental?", content: "El Análisis Fundamental implica evaluar el valor intrínseco de una divisa examinando factores económicos y financieros relacionados. El objetivo es determinar si una divisa está sobrevalorada o infravalorada." },
                    { id: "4-6", title: "P6: ¿Qué factores se consideran en el Análisis Fundamental?", content: "Los factores clave incluyen las tasas de interés establecidas por los bancos centrales, el crecimiento del PIB, las tasas de inflación (IPC), los datos de empleo (como el NFP) y la estabilidad política." },
                    { id: "4-7", title: "P7: ¿Cómo afectan las tasas de interés a una divisa?", content: "Generalmente, las tasas de interés más altas hacen que una divisa sea más atractiva para los inversores extranjeros, aumentando la demanda y haciendo que el valor de la divisa aumente. Por el contrario, las tasas de interés más bajas pueden debilitar una divisa." },
                    { id: "4-8", title: "P8: ¿Qué es el Análisis Sentimental?", content: "El Análisis Sentimental implica medir el estado de ánimo o el sentimiento general de los participantes del mercado (la 'multitud') hacia un par de divisas en particular. Pregunta: '¿El mercado es generalmente alcista o bajista?'" },
                    { id: "4-9", title: "P9: ¿Cómo puedes medir el sentimiento del mercado?", content: "El sentimiento se puede medir a través de herramientas como el informe de Compromiso de los Traders (COT), que muestra las posiciones de los grandes traders, y observando los titulares de las noticias y los datos de posicionamiento del mercado de los brokers." },
                    { id: "4-10", title: "P10: ¿Deberías usar solo un tipo de análisis?", content: "No. La mayoría de los traders exitosos utilizan una combinación de tipos de análisis. Por ejemplo, podrían usar el análisis fundamental para determinar la tendencia a largo plazo y el análisis técnico para encontrar puntos de entrada y salida precisos." },
                    { id: "4-11", title: "P11: ¿Qué es un enfoque de análisis 'de arriba hacia abajo'?", content: "Esto implica comenzar con una visión macroeconómica amplia (análisis fundamental) para identificar economías fuertes frente a débiles, y luego profundizar en pares de divisas específicos y usar el análisis técnico para cronometrar las operaciones." },
                    { id: "4-12", title: "P12: ¿Qué es un enfoque 'de abajo hacia arriba'?", content: "Este enfoque se centra principalmente en un patrón de gráfico o señal individual (análisis técnico) y luego considera los factores fundamentales como una confirmación secundaria." },
                    { id: "4-13", title: "P13: ¿Qué es el trading de 'Acción del Precio' (Price Action)?", content: "El trading de acción del precio es una forma de análisis técnico que se enfoca puramente en leer el gráfico de velas en sí, sin depender en gran medida de indicadores rezagados. Se trata de entender la historia que el precio está contando." },
                    { id: "4-14", title: "P14: ¿Qué es el 'Análisis Cuantitativo'?", content: "Este es un enfoque altamente matemático y estadístico para analizar datos de mercado. A menudo es utilizado por grandes fondos de cobertura e instituciones financieras para construir algoritmos de trading complejos." },
                    { id: "4-15", title: "P15: ¿Cómo pueden los eventos de noticias impactar los patrones técnicos?", content: "Una publicación de noticias importante (p. ej., una decisión sobre la tasa de interés) puede invalidar por completo un patrón técnico. Por eso, muchos traders técnicos evitan mantener posiciones durante eventos de noticias importantes." },
                    { id: "4-16", title: "P16: ¿Qué marco de tiempo es mejor para el análisis fundamental?", content: "Los factores fundamentales tienden a manifestarse en períodos más largos. Por lo tanto, el análisis fundamental es más útil para los traders a largo plazo (swing o position traders) que mantienen operaciones durante días, semanas o meses." },
                    { id: "4-17", title: "P17: ¿Qué marco de tiempo es mejor para el análisis técnico?", content: "El análisis técnico se puede aplicar a cualquier marco de tiempo, desde gráficos de 1 minuto (para scalpers) hasta gráficos semanales (para position traders). Los principios siguen siendo los mismos." },
                    { id: "4-18", title: "P18: ¿Qué es un indicador 'adelantado' (leading)?", content: "Un indicador adelantado está diseñado para preceder los movimientos futuros del precio. Ejemplos incluyen el RSI y el Oscilador Estocástico, que pueden señalar condiciones de sobrecompra/sobreventa antes de una reversión del precio." },
                    { id: "4-19", title: "P19: ¿Qué es un indicador 'rezagado' (lagging)?", content: "Un indicador rezagado sigue la acción del precio y confirma lo que ya ha sucedido. Las Medias Móviles son un ejemplo clásico. Son útiles para confirmar la dirección de la tendencia." },
                    { id: "4-20", title: "P20: ¿Cómo funcionan juntos los tres tipos de análisis?", content: "1. Los fundamentales te dicen POR QUÉ podría moverse un mercado. 2. Los técnicos te dicen CUÁNDO podría moverse. 3. El sentimiento te dice HASTA DÓNDE podría moverse según el posicionamiento actual del mercado." }
                ]
            }
        ]
      },
      {
        stage: "Etapa 2: Estrategias Intermedias",
        icon: 'Target',
        description: "Amplía tus conocimientos con patrones técnicos, indicadores y gestión de riesgos.",
        lessons: [
            { 
              id: "s2-l1", 
              title: "Lección 1: Introducción a los Tipos de Gráficos", 
              subLessons: [
                  {id: "s2-l1-1", title: "P1: ¿Cuáles son los tres principales tipos de gráficos en el trading?", content: "Los tres principales tipos de gráficos son los gráficos de Línea, los gráficos de Barras y los gráficos de Velas Japonesas."},
                  {id: "s2-l1-2", title: "P2: ¿Cómo funciona un gráfico de Línea?", content: "Un gráfico de Línea es el tipo más simple. Conecta una serie de precios de cierre durante un período específico, formando una única línea continua. Es útil para ver la tendencia general pero carece de detalles."},
                  {id: "s2-l1-3", title: "P3: ¿Qué información proporciona un gráfico de Línea?", content: "Solo proporciona el precio de cierre para cada período. No puedes ver los precios de apertura, máximo o mínimo de ese período."},
                  {id: "s2-l1-4", title: "P4: ¿Qué es un gráfico de Barras (gráfico OHLC)?", content: "Un gráfico de Barras proporciona más información que un gráfico de línea. Cada barra representa un solo período y muestra cuatro precios clave: Apertura, Máximo, Mínimo y Cierre (OHLC)."},
                  {id: "s2-l1-5", title: "P5: ¿Cómo se lee una barra en un gráfico de Barras?", content: "La línea vertical muestra el rango entre el precio máximo y mínimo. Una pequeña marca horizontal a la izquierda muestra el precio de apertura, y una pequeña marca horizontal a la derecha muestra el precio de cierre."},
                  {id: "s2-l1-6", title: "P6: ¿Qué es un gráfico de Velas Japonesas?", content: "Un gráfico de Velas Japonesas es el tipo más popular. Al igual que un gráfico de barras, muestra los precios de Apertura, Máximo, Mínimo y Cierre, pero lo hace de una manera más visual y fácil de leer."},
                  {id: "s2-l1-7", title: "P7: ¿Cuáles son los componentes de una vela japonesa?", content: "Una vela tiene dos partes principales: el 'cuerpo' (la parte ancha) y las 'mechas' o 'sombras' (las líneas delgadas que se extienden desde el cuerpo)."},
                  {id: "s2-l1-8", title: "P8: ¿Qué representa el 'cuerpo' de una vela?", content: "El cuerpo representa el rango entre el precio de apertura y el de cierre para ese período. Su color indica la dirección del movimiento del precio."},
                  {id: "s2-l1-9", title: "P9: ¿Qué significa un cuerpo de vela verde (o blanco/azul)?", content: "Una vela verde (o alcista) significa que el precio de cierre fue más alto que el de apertura. El precio subió durante ese período."},
                  {id: "s2-l1-10", title: "P10: ¿Qué significa un cuerpo de vela rojo (o negro)?", content: "Una vela roja (o bajista) significa que el precio de cierre fue más bajo que el de apertura. El precio bajó durante ese período."},
                  {id: "s2-l1-11", title: "P11: ¿Qué muestran las 'mechas' (o sombras) de una vela?", content: "Las mechas muestran los precios más altos y más bajos alcanzados durante el período. La parte superior de la mecha superior es el máximo, y la parte inferior de la mecha inferior es el mínimo."},
                  {id: "s2-l1-12", title: "P12: ¿Por qué son tan populares los gráficos de Velas Japonesas?", content: "Son populares porque facilitan la visualización de la relación entre la apertura y el cierre, así como el máximo y el mínimo. Los colores y patrones formados por las velas pueden revelar la psicología del mercado."},
                  {id: "s2-l1-13", title: "P13: ¿Qué información pierdes con un gráfico de Línea?", content: "Con un gráfico de línea, pierdes toda la información sobre la volatilidad del precio dentro de un período. No conoces la apertura, el máximo o el mínimo, solo dónde terminó el período."},
                  {id: "s2-l1-14", title: "P14: ¿Qué es un 'marco de tiempo' (timeframe) en los gráficos?", content: "Un marco de tiempo es la duración que representa cada barra o vela. Los marcos de tiempo comunes incluyen 1 minuto (M1), 1 hora (H1), 4 horas (H4), diario (D1) y semanal (W1)."},
                  {id: "s2-l1-15", title: "P15: ¿Cómo afecta el cambio de marco de tiempo al gráfico?", content: "Un marco de tiempo más pequeño (como M5) muestra más detalles y 'ruido' en los movimientos de precios. Un marco de tiempo más grande (como D1) filtra el ruido y muestra la tendencia más significativa a largo plazo."},
                  {id: "s2-l1-16", title: "P16: ¿Qué tipo de gráfico es mejor para identificar patrones?", content: "Los gráficos de velas japonesas son, con diferencia, los mejores para identificar patrones de precios. La naturaleza visual de las velas hace que patrones como 'envolvente' o 'doji' sean mucho más fáciles de detectar."},
                  {id: "s2-l1-17", title: "P17: ¿Qué sugiere una mecha superior larga en una vela?", content: "Una mecha superior larga sugiere que los compradores intentaron subir el precio significativamente, pero los vendedores intervinieron y lo empujaron hacia abajo antes del cierre del período. Puede ser una señal de presión vendedora."},
                  {id: "s2-l1-18", title: "P18: ¿Qué sugiere una mecha inferior larga en una vela?", content: "Una mecha inferior larga sugiere que los vendedores intentaron bajar el precio, pero los compradores intervinieron y lo empujaron hacia arriba antes del cierre. Puede ser una señal de presión compradora."},
                  {id: "s2-l1-19", title: "P19: ¿Puedes usar diferentes tipos de gráficos juntos?", content: "Sí. Algunos traders pueden usar un gráfico de línea en un marco de tiempo más alto para ver la tendencia limpia a largo plazo, y luego cambiar a un gráfico de velas en un marco de tiempo más bajo para encontrar puntos de entrada precisos."},
                  {id: "s2-l1-20", title: "P20: Para un principiante, ¿qué tipo de gráfico se recomienda para empezar?", content: "Los gráficos de velas japonesas son muy recomendables. Aunque tienen una ligera curva de aprendizaje, la cantidad de información y claridad que proporcionan es esencial para aprender el análisis técnico moderno."}
              ]
            },
            { 
                id: "s2-l2", 
                title: "Lección 2: Inmersión Profunda en Velas Japonesas", 
                subLessons: [
                    { id: "s2-l2-1", title: "P1: ¿Cuál es el principio fundamental del análisis de una sola vela?", content: "El principio fundamental es que la forma de una sola vela puede revelar la psicología del mercado (la batalla entre compradores y vendedores) durante ese período específico, a menudo señalando posibles reversiones o indecisión." },
                    { id: "s2-l2-2", title: "P2: ¿Qué es una vela 'Doji'?", content: "Un Doji es una vela con un cuerpo muy pequeño o inexistente, lo que significa que los precios de apertura y cierre son casi idénticos. Señala indecisión y un posible punto de inflexión en el mercado." },
                    { id: "s2-l2-3", title: "P3: ¿Cuáles son los principales tipos de Doji?", content: "Los tipos principales son el Doji Neutral (forma de cruz), el Doji de Piernas Largas (mechas superior e inferior largas), el Doji Libélula (mecha inferior larga, sin mecha superior) y el Doji Lápida (mecha superior larga, sin mecha inferior)." },
                    { id: "s2-l2-4", title: "P4: ¿Qué sugiere un 'Doji Libélula' (Dragonfly Doji) en la parte inferior de una tendencia bajista?", content: "Es una fuerte señal de reversión alcista. Muestra que los vendedores empujaron el precio hacia abajo, pero los compradores tomaron el control total al final del período, empujando el precio de nuevo hasta la apertura." },
                    { id: "s2-l2-5", title: "P5: ¿Qué sugiere un 'Doji Lápida' (Gravestone Doji) en la parte superior de una tendencia alcista?", content: "Es una fuerte señal de reversión bajista. Muestra que los compradores empujaron el precio hacia arriba, but los vendedores los abrumaron, empujando el precio de vuelta hasta la apertura." },
                    { id: "s2-l2-6", title: "P6: ¿Qué es una vela 'Peonza' (Spinning Top)?", content: "Una Peonza tiene un cuerpo pequeño con largas mechas superior e inferior de tamaño similar. Al igual que un Doji, significa indecisión en el mercado, ya que ni los compradores ni los vendedores pudieron tomar el control." },
                    { id: "s2-l2-7", title: "P7: ¿Qué es una vela 'Martillo' (Hammer)?", content: "Un Martillo es un patrón de reversión alcista que se encuentra en la parte inferior de una tendencia bajista. Tiene un cuerpo pequeño en la parte superior, una mecha inferior larga (al menos el doble del tamaño del cuerpo) y poca o ninguna mecha superior." },
                    { id: "s2-l2-8", title: "P8: ¿Cuál es la psicología detrás de un Martillo?", content: "Muestra que los vendedores tenían el control inicialmente, empujando el precio muy abajo. Sin embargo, surgió una fuerte presión de compra y el precio repuntó para cerrar cerca de su apertura, señalando un posible fondo." },
                    { id: "s2-l2-9", title: "P9: ¿Qué es una vela 'Hombre Colgado' (Hanging Man)?", content: "Un Hombre Colgado se ve idéntico a un Martillo pero aparece en la parte superior de una tendencia alcista. Es una señal de reversión bajista, que sugiere que la presión de venta está comenzando a aparecer." },
                    { id: "s2-l2-10", title: "P10: ¿Por qué un Hombre Colgado es bajista si se parece a un Martillo alcista?", content: "El contexto es clave. En la parte superior de una tendencia alcista, la larga mecha inferior muestra que ocurrió una venta significativa durante el período, aunque los compradores lograron empujarlo hacia arriba. Es una advertencia de que los vendedores están probando el mercado." },
                    { id: "s2-l2-11", title: "P11: ¿Qué es un 'Martillo Invertido'?", content: "Un Martillo Invertido es un patrón de reversión alcista que se encuentra en la parte inferior de una tendencia bajista. Parece un Martillo al revés: cuerpo pequeño en la parte inferior, mecha superior larga y poca o ninguna mecha inferior." },
                    { id: "s2-l2-12", title: "P12: ¿Cuál es la psicología de un Martillo Invertido?", content: "Muestra que los compradores intentaron hacer subir el precio, but los vendedores lo empujaron de nuevo hacia abajo. Sin embargo, el hecho de que los compradores mostraran esta fuerza después de una tendencia bajista es una señal potencial de que los vendedores están perdiendo momentum." },
                    { id: "s2-l2-13", title: "P13: ¿Qué es una 'Estrella Fugaz'?", content: "Una Estrella Fugaz se ve idéntica a un Martillo Invertido pero aparece en la parte superior de una tendencia alcista. Es una fuerte señal de reversión bajista." },
                    { id: "s2-l2-14", title: "P14: ¿Cuál es la psicología detrás de una Estrella Fugaz?", content: "En la parte superior de una tendencia alcista, los compradores empujan el precio más alto, pero los vendedores intervienen con una fuerza abrumadora, empujando el precio hacia abajo para cerrar cerca de la apertura. Esto señala que la tendencia alcista puede haber terminado." },
                    { id: "s2-l2-15", title: "P15: ¿Qué es una vela 'Marubozu'?", content: "Un Marubozu es una vela con un cuerpo lleno y sin mechas en absoluto. Un Marubozu verde es extremadamente alcista (los compradores tuvieron el control de principio a fin). Un Marubozu rojo es extremadamente bajista (los vendedores tuvieron el control)." },
                    { id: "s2-l2-16", title: "P16: ¿Importa el color del cuerpo de un Martillo?", content: "Un Martillo verde (donde el cierre está por encima de la apertura) se considera ligeramente más alcista que un Martillo rojo, pero ambos son señales de reversión válidas. La forma es más importante que el color." },
                    { id: "s2-l2-17", title: "P17: ¿Importa el color del cuerpo de una Estrella Fugaz?", content: "Una Estrella Fugaz roja (donde el cierre está por debajo de la apertura) se considera ligeramente más bajista que una verde, pero de nuevo, ambos son señales bajistas válidas. La mecha superior larga es la característica clave." },
                    { id: "s2-l2-18", title: "P18: ¿Qué es la 'confirmación' en el trading de velas?", content: "La confirmación es cuando la siguiente vela después de una señal de patrón se mueve en la dirección esperada. Por ejemplo, después de un Martillo, una confirmación sería que la siguiente vela cerrara más alto." },
                    { id: "s2-l2-19", title: "P19: ¿Son confiables los patrones de una sola vela por sí solos?", content: "Son más confiables cuando aparecen en un nivel técnico significativo, como una zona de soporte/resistencia importante, una línea de tendencia o una media móvil clave. El contexto lo es todo." },
                    { id: "s2-l2-20", title: "P20: ¿Cuál es la principal diferencia entre un Doji y una Peonza?", content: "Ambos señalan indecisión. La principal diferencia visual es que un Doji tiene una línea para un cuerpo (la apertura y el cierre son casi idénticos), mientras que una Peonza tiene un cuerpo corto, pero visible, rectangular." }
                ]
            },
            { 
                id: "s2-l3", 
                title: "Lección 3: Patrones de Velas Dobles", 
                subLessons: [
                  { id: "s2-l3-1", title: "P1: ¿Qué define un patrón de velas dobles?", content: "Un patrón de velas dobles es una señal formada por dos velas consecutivas que, al leerse juntas, proporcionan una indicación más fuerte de una posible reversión o continuación del mercado que una sola vela." },
                  { id: "s2-l3-2", title: "P2: ¿Qué es el patrón 'Envolvente Alcista' (Bullish Engulfing)?", content: "Un patrón Envolvente Alcista ocurre al final de una tendencia bajista. Consiste en una pequeña vela bajista seguida de una vela alcista más grande cuyo cuerpo 'envuelve' completamente el cuerpo de la vela anterior. Es una fuerte señal de reversión." },
                  { id: "s2-l3-3", title: "P3: ¿Cuál es la psicología detrás del patrón Envolvente Alcista?", content: "La primera vela muestra que los vendedores tienen el control. La segunda vela, más grande, muestra que los compradores intervinieron con una fuerza abrumadora, no solo borrando el progreso de los vendedores, sino también cerrando significativamente más alto, lo que indica un poderoso cambio de impulso." },
                  { id: "s2-l3-4", title: "P4: ¿Qué es el patrón 'Envolvente Bajista' (Bearish Engulfing)?", content: "Un patrón Envolvente Bajista ocurre en la cima de una tendencia alcista. Es lo opuesto a la versión alcista: una pequeña vela alcista es seguida por una vela bajista más grande que envuelve completamente el cuerpo de la vela anterior. Es una fuerte señal de reversión bajista." },
                  { id: "s2-l3-5", title: "P5: ¿Qué es un patrón 'Pinzas de Fondo' (Tweezer Bottom)?", content: "Un patrón de Pinzas de Fondo es un patrón de reversión alcista. Consiste en dos velas consecutivas con mínimos casi idénticos. La primera vela es bajista y la segunda es alcista, mostrando que el mercado rechazó el nivel de precios más bajo." },
                  { id: "s2-l3-6", title: "P6: ¿Qué es un patrón 'Pinzas de Techo' (Tweezer Top)?", content: "Un patrón de Pinzas de Techo es un patrón de reversión bajista. Consiste en dos velas consecutivas con máximos casi idénticos. La primera vela es alcista y la segunda es bajista, lo que indica que el mercado rechazó el nivel de precios más alto." },
                  { id: "s2-l3-7", title: "P7: ¿Qué es el patrón 'Línea Penetrante' (Piercing Line)?", content: "La Línea Penetrante es un patrón de reversión alcista que se encuentra después de una tendencia bajista. Es un patrón de dos velas: la primera es una fuerte vela bajista, y la segunda es una vela alcista que abre por debajo del mínimo de la primera pero cierra más de la mitad del cuerpo de la primera." },
                  { id: "s2-l3-8", title: "P8: ¿Qué significa el patrón de Línea Penetrante?", content: "Significa un posible fondo. El gap a la baja en la apertura de la segunda vela muestra una fuerte presión vendedora, pero el potente rally para cerrar bien adentro del cuerpo de la vela anterior muestra que los compradores han tomado un control significativo." },
                  { id: "s2-l3-9", title: "P9: ¿Qué es el patrón 'Nube Oscura' (Dark Cloud Cover)?", content: "La Nube Oscura es la contraparte bajista de la Línea Penetrante y ocurre después de una tendencia alcista. La primera vela es una fuerte vela alcista. La segunda vela es bajista, abre por encima del máximo de la primera, pero luego cierra más de la mitad del cuerpo de la primera vela." },
                  { id: "s2-l3-10", title: "P10: ¿Por qué los patrones dobles son generalmente más confiables que los patrones individuales?", content: "Los patrones dobles proporcionan más información sobre el comportamiento del mercado durante dos períodos. Pueden mostrar una lucha más definitiva y un cambio más claro en el poder entre compradores y vendedores, lo que aumenta la fiabilidad del patrón." }
                ]
            },
            { 
                id: "s2-l4", 
                title: "Lección 4: Patrones de Velas Triples", 
                subLessons: [
                  { id: "s2-l4-1", title: "P1: ¿Qué es un patrón de velas triples?", content: "Un patrón de velas triples es una señal formada por tres velas consecutivas. Estos patrones generalmente se consideran algunas de las señales de velas más confiables porque representan tres sesiones completas de psicología de mercado." },
                  { id: "s2-l4-2", title: "P2: ¿Qué es el patrón 'Estrella de la Mañana' (Morning Star)?", content: "La Estrella de la Mañana es un potente patrón de reversión alcista que ocurre al final de una tendencia bajista. Consiste en tres velas: 1) una gran vela bajista, 2) una vela de cuerpo pequeño (como un Doji o una peonza) que hace un gap a la baja, y 3) una gran vela alcista que cierra al menos a la mitad del cuerpo de la primera vela." },
                  { id: "s2-l4-3", title: "P3: ¿Cuál es la psicología de la Estrella de la Mañana?", content: "Muestra una transición clara: los vendedores tienen el control total (vela 1), luego hay un momento de completa indecisión y una posible detención del impulso (vela 2), seguido por los compradores que toman el control decisivo (vela 3)." },
                  { id: "s2-l4-4", title: "P4: ¿Qué es el patrón 'Estrella del Atardecer' (Evening Star)?", content: "La Estrella del Atardecer es la contraparte bajista de la Estrella de la Mañana y señala un posible techo. Aparece después de una tendencia alcista y consiste en: 1) una gran vela alcista, 2) una vela de cuerpo pequeño que hace un gap al alza, y 3) una gran vela bajista que cierra al menos a la mitad del cuerpo de la primera vela." },
                  { id: "s2-l4-5", title: "P5: ¿Qué son los 'Tres Soldados Blancos'?", content: "Este es un fuerte patrón de reversión o continuación alcista. Consiste en tres largas velas alcistas consecutivas, cada una cerrando más alto que la anterior. Idealmente, cada vela abre dentro del cuerpo de la anterior." },
                  { id: "s2-l4-6", title: "P6: ¿Qué significan los Tres Soldados Blancos?", content: "Significan un avance constante y potente por parte de los compradores. La falta de mechas largas en las velas indica que los compradores han tenido el control desde la apertura hasta el cierre durante tres períodos consecutivos." },
                  { id: "s2-l4-7", title: "P7: ¿Qué son los 'Tres Cuervos Negros'?", content: "Este es el homólogo bajista de los Tres Soldados Blancos. Consiste en tres largas velas bajistas consecutivas, cada una cerrando más bajo que la anterior. Es una fuerte señal de reversión o continuación bajista." },
                  { id: "s2-l4-8", title: "P8: ¿Qué es el patrón 'Tres Hacia Arriba' (Three Inside Up)?", content: "Este es un patrón de reversión alcista. Comienza con una gran vela bajista. La segunda vela es una pequeña vela alcista contenida dentro del cuerpo de la primera. La tercera vela es una vela alcista que cierra por encima del máximo de la primera vela, confirmando la reversión." },
                  { id: "s2-l4-9", title: "P9: ¿Qué es el patrón 'Tres Hacia Abajo' (Three Inside Down)?", content: "Este es un patrón de reversión bajista. Comienza con una gran vela alcista. La segunda vela es una pequeña vela bajista contenida dentro del cuerpo de la primera vela. La tercera vela es una vela bajista que cierra por debajo del mínimo de la primera vela, confirmando la reversión bajista." },
                  { id: "s2-l4-10", title: "P10: ¿Dónde son más efectivos los patrones de velas triples?", content: "Como todos los patrones de velas, son más confiables y efectivos cuando se forman en un nivel técnico significativo, como una zona de soporte o resistencia importante, un nivel clave de Fibonacci o una línea de tendencia a largo plazo." }
                ]
            },
            { 
              id: "s2-l5", 
              title: "Lección 5: Identificación de Soporte y Resistencia", 
              subLessons: [
                { id: "s2-l5-1", title: "P1: ¿Qué es un nivel de Soporte?", content: "Un nivel de Soporte es un punto de precio en un gráfico donde el interés de compra es históricamente lo suficientemente fuerte como para superar la presión de venta. Actúa como un 'piso' que impide que el precio siga cayendo." },
                { id: "s2-l5-2", title: "P2: ¿Qué es un nivel de Resistencia?", content: "Un nivel de Resistencia es un punto de precio donde la presión de venta es históricamente lo suficientemente fuerte como para superar el interés de compra. Actúa como un 'techo' que impide que el precio siga subiendo." },
                { id: "s2-l5-3", title: "P3: ¿Cómo se identifica un nivel de Soporte potencial?", content: "Busca mínimos de oscilación (valles) anteriores en el gráfico. Se puede trazar una línea horizontal que conecte múltiples puntos bajos. Cuantas más veces el precio haya tocado y rebotado en este nivel, más fuerte se considera." },
                { id: "s2-l5-4", title: "P4: ¿Cómo se identifica un nivel de Resistencia potencial?", content: "Busca máximos de oscilación (picos) anteriores en el gráfico. Una línea horizontal que conecta múltiples puntos altos indica un nivel de resistencia. Cuantos más rechazos haya desde este nivel, más fuerte es." },
                { id: "s2-l5-5", title: "P5: ¿Cuál es el principio de 'Inversión de Roles' (Role Reversal)?", content: "Este es un concepto clave donde un nivel de soporte roto puede convertirse en un nuevo nivel de resistencia, y un nivel de resistencia roto puede convertirse en un nuevo nivel de soporte. También se conoce como zona 'flip'." },
                { id: "s2-l5-6", title: "P6: ¿Por qué ocurre la Inversión de Roles?", content: "Se basa en la psicología del mercado. Cuando se rompe un nivel de soporte, los compradores que compraron en ese nivel ahora están en una posición perdedora. Pueden buscar vender a su precio de entrada (el antiguo soporte) si el precio regresa, creando una nueva resistencia." },
                { id: "s2-l5-7", title: "P7: ¿Son el soporte y la resistencia puntos de precio únicos o zonas?", content: "Es mejor pensar en ellos como zonas o áreas en lugar de líneas exactas. El precio puede no detenerse en el mismo precio exacto cada vez, por lo que dibujar una pequeña 'caja' o 'zona' suele ser más práctico." },
                { id: "s2-l5-8", title: "P8: ¿Cómo afecta el marco de tiempo al soporte y la resistencia?", content: "Los niveles identificados en marcos de tiempo más altos (como Diario o Semanal) son mucho más significativos y fuertes que los niveles identificados en marcos de tiempo más bajos (como 15 minutos o 1 hora)." },
                { id: "s2-l5-9", title: "P9: ¿Qué otras herramientas pueden ayudar a identificar el soporte y la resistencia?", content: "Además de las líneas horizontales, otras herramientas incluyen: líneas de tendencia, canales, medias móviles (soporte/resistencia dinámico), niveles de retroceso de Fibonacci y puntos de pivote." },
                { id: "s2-l5-10", title: "P10: ¿Qué significa una 'ruptura' (breakout) de un nivel?", content: "Una ruptura ocurre cuando el precio se mueve decisivamente a través de un nivel de soporte o resistencia y cierra más allá de él. Una ruptura por encima de la resistencia es una señal alcista, mientras que una ruptura por debajo del soporte es una señal bajista." }
              ]
            },
            { 
              id: "s2-l6", 
              title: "Lección 6: Líneas de Tendencia y Canales", 
              subLessons: [
                { id: "s2-l6-1", title: "P1: ¿Qué es una Línea de Tendencia?", content: "Una línea de tendencia es una línea recta dibujada en un gráfico que conecta una serie de puntos de precio para identificar la dirección y la inclinación de una tendencia." },
                { id: "s2-l6-2", title: "P2: ¿Cómo se dibuja una Línea de Tendencia Alcista?", content: "Una línea de tendencia alcista se dibuja conectando al menos dos 'mínimos de oscilación' (valles) significativos. La línea debe tener una pendiente positiva y la acción del precio debe estar por encima de la línea." },
                { id: "s2-l6-3", title: "P3: ¿Cómo se dibuja una Línea de Tendencia Bajista?", content: "Una línea de tendencia bajista se dibuja conectando al menos dos 'máximos de oscilación' (picos) significativos. La línea debe tener una pendiente negativa y la acción del precio debe estar por debajo de la línea." },
                { id: "s2-l6-4", title: "P4: ¿Cuántos 'toques' hacen que una línea de tendencia sea válida?", content: "Una línea de tendencia requiere al menos dos puntos para ser dibujada. Sin embargo, un tercer toque de la línea es lo que la valida y la convierte en un nivel técnico significativo a observar." },
                { id: "s2-l6-5", title: "P5: ¿Cómo se utilizan las líneas de tendencia en el trading?", content: "Los traders utilizan las líneas de tendencia como soporte dinámico (en una tendencia alcista) o resistencia dinámica (en una tendencia bajista). Pueden buscar comprar cuando el precio retrocede a una línea de tendencia alcista o vender cuando el precio sube a una línea de tendencia bajista." },
                { id: "s2-l6-6", title: "P6: ¿Qué significa cuando una línea de tendencia se 'rompe'?", content: "Una ruptura de línea de tendencia ocurre cuando el precio cierra decisivamente al otro lado de la línea. Una ruptura de una línea de tendencia alcista es una posible señal bajista, y una ruptura de una línea de tendencia bajista es una posible señal alcista." },
                { id: "s2-l6-7", title: "P7: ¿Qué es un Canal de Precios?", content: "Un canal de precios (o canal de tendencia) se crea dibujando una segunda línea paralela a una línea de tendencia existente. En una tendencia alcista, esta línea paralela conecta los máximos de oscilación. En una tendencia bajista, conecta los mínimos de oscilación." },
                { id: "s2-l6-8", title: "P8: ¿Qué muestra un canal de precios?", content: "Un canal contiene la mayor parte de la acción del precio y puede ayudar a identificar condiciones de sobrecompra (en la parte superior del canal) y sobreventa (en la parte inferior del canal) dentro de una tendencia." },
                { id: "s2-l6-9", title: "P9: ¿Deberías ajustar una línea de tendencia si se rompe ligeramente?", content: "A veces. Si el precio perfora brevemente la línea pero no cierra decisivamente más allá de ella, algunos traders ajustarán la línea para que se ajuste mejor a la acción del precio más reciente. Sin embargo, los ajustes frecuentes pueden anular su propósito." },
                { id: "s2-l6-10", title: "P10: ¿Es importante la inclinación (ángulo) de una línea de tendencia?", content: "Sí. Una línea de tendencia muy pronunciada a menudo es insostenible y es probable que se rompa antes. Un ángulo más moderado (alrededor de 30-45 grados) a menudo indica una tendencia más saludable y sostenible." }
              ]
            },
          { id: "s2-l7", title: "Lesson 7: Chart Patterns Part 1 - Reversal Patterns", content: "Learn to spot major reversal patterns like Head and Shoulders, Inverse Head and Shoulders, and Double/Triple Tops and Bottoms." },
          { id: "s2-l8", title: "Lesson 8: Chart Patterns Part 2 - Continuation Patterns", content: "Identify patterns that suggest the current trend will continue, such as Triangles (Symmetrical, Ascending, Descending), Flags, and Pennants." },
          { id: "s2-l9", title: "Lesson 9: Introduction to Technical Indicators", content: "Understand the difference between leading and lagging indicators and how they can be used to confirm price action, not predict it." },
          { id: "s2-l10", title: "Lesson 10: Moving Averages (MA)", content: "Learn about Simple Moving Averages (SMA) and Exponential Moving Averages (EMA). Understand how they can be used to identify trend direction and as dynamic support/resistance." },
          { id: "s2-l11", title: "Lesson 11: Moving Average Crossovers", content: "Discover the concept of the 'Golden Cross' (e.g., 50 EMA crossing above 200 EMA) and 'Death Cross' as long-term trend signals." },
          { id: "s2-l12", title: "Lesson 12: Relative Strength Index (RSI)", content: "Learn how to use the RSI to identify overbought (&gt;70) and oversold (&lt;30) conditions. Also, learn about the powerful concept of RSI divergence." },
          { id: "s2-l13", title: "Lesson 13: Moving Average Convergence Divergence (MACD)", content: "Understand the components of the MACD (MACD line, signal line, histogram) and how to use crossovers and the histogram to gauge momentum." },
          { id: "s2-l14", title: "Lesson 14: Bollinger Bands", content: "Learn how the three bands (upper, middle, lower) represent volatility. Understand concepts like 'the squeeze' and how prices react to the outer bands." },
          { id: "s2-l15", title: "Lesson 15: Fibonacci Retracement", content: "Discover how to use the Fibonacci tool to identify potential support and resistance levels after a significant price move. Key levels include 38.2%, 50%, and 61.8%." },
          { id: "s2-l16", title: "Lesson 16: Stochastic Oscillator", content: "Similar to RSI, learn how the Stochastic Oscillator can identify overbought (&gt;80) and oversold (&lt;20) conditions by comparing a closing price to its price range over a period." },
          { id: "s2-l17", title: "Lesson 17: Introduction to Risk Management", content: "The most important topic. Understand that your primary job as a trader is to manage risk, not to be right all the time." },
          { id: "s2-l18", title: "Lesson 18: Setting a Stop-Loss", content: "Learn different methods for placing a stop-loss: based on a key level, a percentage of your account, or volatility (e.g., using ATR)." },
          { id: "s2-l19", title: "Lesson 19: Calculating Position Size", content: "Learn the formula to determine the correct lot size for any trade based on your account size, risk percentage, and stop-loss distance. This is crucial for capital preservation." },
          { id: "s2-l20", title: "Lesson 20: Risk-to-Reward Ratio", content: "Understand how to calculate and use the risk-to-reward ratio. Aim for trades where the potential profit is at least twice the potential loss (e.g., 1:2 R:R)." },
          { id: "s2-l21", title: "Lesson 21: Introduction to Fundamental Analysis", content: "Learn how major economic news releases, such as interest rate decisions, GDP, and employment data (like NFP), can dramatically impact currency prices." },
        ]
      },
      {
        stage: "Etapa 3: Técnicas Avanzadas",
        icon: 'BrainCircuit',
        description: "Master the psychological and risk aspects of trading to achieve consistency.",
        lessons: [
          {
            id: "lesson-10",
            title: "Lección 10: Gestión de Riesgos Avanzada",
            content: "Implement strategies like the 1% rule (never risk more than 1% of your account on a single trade), using trailing stops to lock in profits, and calculating position size based on volatility and stop-loss distance."
          },
        ]
      }
    ]
  }
};
    
