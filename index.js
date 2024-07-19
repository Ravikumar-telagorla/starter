const axios = require('axios');
const getAPI = 'https://interview.adpeai.com/api/v2/get-task';

async function getData() {
    const result = await axios.get(getAPI);
    const earners = [];
    let topEarner;
    const date = new Date();
    result.data.transactions.forEach(e => {
        const year = e.timeStamp.split('-');
        if (Number(year[0]) === date.getFullYear()-1 && e.type === 'alpha') {
            if(earners[e.employee.id] >= 0) {
                earners[e.employee.id] += e.amount;
            } else {
                earners[e.employee.id] = 0;
            }
        }
    });
    let heighest = 0;
    Object.entries(earners).forEach(([k, v]) => {
        if (heighest < v) {
            topEarner = k;
            heighest = v;
        }
      });
    let transactions = [];
    result.data.transactions.forEach(e => {
        if (e.employee.id === topEarner) {
            transactions.push(e.transactionID)
        }
    });
    const res = await axios.post('https://interview.adpeai.com/api/v2/submit-task',
        {
            "id": result.data.id,
            "result": transactions
        }
    );
    console.log(res.data)
    return res;
}

getData();
