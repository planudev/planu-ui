const fetch = require('node-fetch');
import Cookies from 'js-cookie';

const address = Cookies.get('address');

function percentage(partialValue, totalValue) {
  return ((100 * partialValue) / totalValue).toFixed(2);
}

module.exports = {
  listToken: async () => {
    const request = await fetch('https://sonic-dashboard.herokuapp.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query {
          user(id: "${address}") {
            balances {
              id
              name
              symbol
              value
              price
              logoURI
            }
          }
        }
      ` 
      }),
    })

    return request.json();
  },

  venus: async () => {
    const request = await fetch('https://sonic-dashboard.herokuapp.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query { 
          venus (address: "${address}") {
            totalSupplyBalance
            totalBorrowBalance
            suppliedTokens {
              underlyingName
              underlyingSymbol
              suppliedAmount
              supplyApy
              logoURI
              price
              isCollateral
            }
            borrowedTokens {
              underlyingName
              underlyingSymbol
              borrowedAmount
              borrowApy
              logoURI
              price
              isCollateral
            }
          }
        }
      ` 
      }),
    })

    return request.json();
  },

  dashboardSummarry: async () => {
    const venusRequest = (await fetch('https://sonic-dashboard.herokuapp.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query { 
          venus (address: "${address}") {
            totalSupplyBalance
            totalBorrowBalance
          }
        }
      ` 
      }),
    })).json();

    const assetRequest = (await fetch('https://sonic-dashboard.herokuapp.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query {
          user(id: "${address}") {
            balances {
              id
              name
              symbol
              value
              price
              logoURI
            }
          }
        }
      ` 
      }),
    })).json();

    let totolAssetUSD = 0;

    (await assetRequest).data.user.balances.forEach(token => {
      totolAssetUSD += token.value * token.price;
    });

    const venusData = (await venusRequest).data.venus;



    return {
      netWorth: (parseFloat(totolAssetUSD) - parseFloat(venusData.totalBorrowBalance || 0)).toFixed(4),
      totolAssetUSD: parseFloat(totolAssetUSD).toFixed(4),
      totalSuppliedVenus: parseFloat(venusData.totalSupplyBalance || 0).toFixed(4),
      totalBorrowedVenus: parseFloat(venusData.totalBorrowBalance || 0).toFixed(4),
      percentWorth: [
        percentage(parseFloat(totolAssetUSD).toFixed(4), (parseFloat(totolAssetUSD) + parseFloat(venusData.totalSupplyBalance || 0) - parseFloat(venusData.totalBorrowBalance || 0)).toFixed(4)),
        percentage(parseFloat(venusData.totalSupplyBalance || 0).toFixed(4), (parseFloat(totolAssetUSD) + parseFloat(venusData.totalSupplyBalance || 0) - parseFloat(venusData.totalBorrowBalance || 0)).toFixed(4))
      ],
      totalDebts: parseFloat(venusData.totalBorrowBalance || 0).toFixed(4),
      percentDebts: [
        percentage(parseFloat(venusData.totalBorrowBalance || 0).toFixed(4), parseFloat(venusData.totalBorrowBalance || 0).toFixed(4)),
      ],
    }
  },
  
  lending: async () => {
    const creamRequest = await fetch('https://sonic-dashboard.herokuapp.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query {
          cream {
            supportTokens {
              name
              symbol
              supplyApy
              logoURI
              underlyingSymbol
            }
          }
        }` 
      }),
    });

    const venusRequest = await fetch('https://sonic-dashboard.herokuapp.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query {
          venusProtocol {
            supportTokens {
              name
              symbol
              supplyApy
              logoURI
              underlyingSymbol
            }
          }
        }` 
      }),
    });

    const forTubeRequest = await fetch('https://sonic-dashboard.herokuapp.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query {
          forTubeProtocol {
            supportTokens {
              name
              symbol
              supplyApy
              logoURI
              underlyingSymbol
            }
          }
        }` 
      }),
    });

    // console.log('await venusRequest.json()', await venusRequest.json())
    // const requestData = await Promise.all[venusRequest, creamRequest, forTubeRequest];

    // console.log('requestData', requestData)

    // let venusData = requestData[0].data.venusProtocol.supportTokens;
    // let creamData = requestData[1].data.cream.supportTokens;
    // let forTubeData = requestData[2].data.forTubeProtocol.supportTokens;

    let venusData = (await venusRequest.json()).data.venusProtocol.supportTokens;
    let creamData = (await creamRequest.json()).data.cream.supportTokens;
    let forTubeData = (await forTubeRequest.json()).data.forTubeProtocol.supportTokens;

    venusData = venusData.map(i => ({ ...i, supplyApyToFixed: parseFloat(i.supplyApy).toFixed(2) }))
    creamData = creamData.map(i => ({ ...i, supplyApyToFixed: parseFloat(i.supplyApy).toFixed(2) }))
    forTubeData = forTubeData.map(i => ({ ...i, supplyApyToFixed: parseFloat(i.supplyApy).toFixed(2) }))

    function mergeArray(array) {

      let tokenSymbol = [];
      array.forEach(a => {
        a.forEach(b => {
          tokenSymbol.push(b.underlyingSymbol)
        });
      });
      tokenSymbol = [...new Set(tokenSymbol)];
    
      let merged = [];
    
      for(let i = 0; i < tokenSymbol.length; i++) {
        merged.push({
         'token': tokenSymbol[i],
         'cream': { ...(creamData.find((itmInner) => itmInner.underlyingSymbol === tokenSymbol[i])) },
         'venus': { ...(venusData.find((itmInner) => itmInner.underlyingSymbol === tokenSymbol[i])) },
         'fortube': { ...(forTubeData.find((itmInner) => itmInner.underlyingSymbol === tokenSymbol[i])) }
        });
      }

      merged = merged.map(i => ({
        ...i,
        max: (Math.max(...[i.cream.supplyApyToFixed || 0, i.venus.supplyApyToFixed || 0, i.fortube.supplyApyToFixed || 0], 0)),
        logoURI: i.cream.logoURI || i.venus.logoURI || i.fortube.logoURI
      }));
      
     return merged;
    
    }

    return mergeArray([venusData, creamData, forTubeData]);
  },

  getTokenIcon: async (symbol) => {
    const iconRequest = await fetch('https://sonic-dashboard.herokuapp.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query {
          logoURI(symbol: "${symbol}")
        }`
      }),
    });

    return (await iconRequest.json()).data.logoURI;
  },

  depositVaults: async (tokenAddress, amount) => {
    return dexContract.methods.swap(tokenAddress, web3.utils.toWei(amount, 'ether')).send({from: ethereum.selectedAddress})
      .on('confirmation', function(confirmationNumber, receipt){
        return receipt;
      })
      .on('error', console.error);
  },
};

// const api = require('./index');

// (async () => {
//   try {
//     const x = await api.lending();
//     console.log(x)
//   } catch (err) {
//     console.log(err)
//   }
  
  
// })();