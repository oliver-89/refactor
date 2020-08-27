const format = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
}).format;

function statement(invoice, plays) {
  return generateInvoice(invoice, plays);
}

function generateInvoice(invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`;
  let totalAmount = countTotalAmount(invoice, plays);
  let volumeCredits = countRedits(invoice, plays);
  result = printLineOfOrder(invoice, plays, result, format);
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

function printLineOfOrder(invoice, plays, result, format) {
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = countEachAmount(play, perf);
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
  }
  return result;
}

function countTotalAmount(invoice, plays) {
  let totalAmount = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = countEachAmount(play, perf);
    totalAmount += thisAmount;
  }
  return totalAmount;
}

function countEachAmount(play, perf) {
  let thisAmount = 0;
  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount;
}

function countRedits(invoice, plays) {
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ('comedy' === play.type)
      volumeCredits += Math.floor(perf.audience / 5);
  }
  return volumeCredits;
}

module.exports = {
  statement,
};

