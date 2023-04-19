// online
// const GRAPH_QL_URL = 'https://indexer.mainnet.aptoslabs.com/v1/graphql';
// test
const GRAPH_QL_URL = 'https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql';

const fetchGraphQL = (options) => {
  const {
    operationName = 'MyQuery',
    variables = {},
    operationsDoc,
    showLoading = false
  } = options;
  showLoading && uni.showLoading({ mask: true });
  return new Promise(async (resolve, reject) => {
    try {
      uni.request({
        url: `${GRAPH_QL_URL}`,
        method: 'POST',
        sslVerify: false,
        data: {
          query: operationsDoc,
          variables: variables,
          operationName: operationName,
        },
        success: function (res) {
          console.log('--------success------------', res);
          if (res.statusCode === 200) {
            resolve(res.data || {})
          } else {
            uni.showToast({
              title: (res.data || {}).message,
              icon: 'none'
            });
            reject(res)
          }
        },
        fail: function (fail) {
          console.log('--------fail------------', fail);
          uni.showToast({
            title: fail.message,
            icon: 'none'
          });
          reject(fail)
        },
        complete: function (err) {
          showLoading && uni.hideLoading();
        },
      })
    } catch (err) {
      console.log('--------err------------', err);
      uni.showToast({
        title: err.message,
        icon: 'none'
      });
      reject(err);
    }
  })
}


export const current_token_pending_claims = ({
  to_address,
  payee_address
}, options) => {
  const operationsDoc = `
    query MyQuery {
      current_token_pending_claims(
        where: {
          to_address: {
            _eq: "${to_address}"
          }, 
          current_token_data: {
            payee_address: {
              _eq: "${payee_address}"
            }, 
            collection_name: {
              _eq: "DAT3 invitation NFT"
            }
          }, 
          amount: {
            _eq: "1"
          }
        }
      ) {
        name
        from_address
        current_token_data {
          name
          metadata_uri
          payee_address
          collection_name
          creator_address
        }
      }
    }
  `;
  return fetchGraphQL({ operationsDoc, ...options });
}

export const current_token_ownerships = ({
  owner_address,
  payee_address
}, options) => {
  const operationsDoc = `
  query MyQuery {
    current_token_ownerships(
      where: {
        owner_address: {
          _eq: "${owner_address}"
        }, 
        current_token_data: {
          payee_address: {
            _eq: "${payee_address}"
          }, 
          collection_name: {
            _eq: "DAT3 invitation NFT"
          }
        },
        amount: {
          _eq: "1"
        }
      }
    ) {
      name
      current_token_data {
        name
        metadata_uri
        payee_address
        collection_name
        creator_address
      }
    }
  }
  `;
  return fetchGraphQL({ operationsDoc, ...options });
}
