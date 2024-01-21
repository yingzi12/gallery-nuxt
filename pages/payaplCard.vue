<template>
  <q-card class="my-card">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6" v-if="props.kind != 1">{{ props.productName }}</div>
      <div class="text-h6" v-if="props.kind==1">{{   $t(`vip.${props.productName}`) }}</div>

      <div class="text-subtitle2">{{ $t(`vip.cancellation`) }}</div>
    </q-card-section>
    <q-card-section>
      {{ props.intro }}
    </q-card-section>
    <q-separator />
    <q-separator dark />

    <q-card-actions >
      <q-btn  class="left-3" flat>价格：{{props.amount}}</q-btn>
      <q-btn  class="left-3" flat>付款金额：{{discountAmount}}</q-btn>

    </q-card-actions>
    <q-separator />

    <q-card-actions justify-center>
      <div >
        <div id="paypal-button-container" class="paypal-button-container"></div>
      </div>
    </q-card-actions>
  </q-card>


</template>

<script setup>
import {defineProps, onMounted} from 'vue';
import {useQuasar} from "quasar";
const $q = useQuasar();
const tokenCookie = useCookie('token');
const token=tokenCookie.value;
const props = defineProps({
  amount: {
    type: String,
    required: true
  },
  kind: {
    type: Number,
    required: true
  },
  productId: {
    type: Number,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  intro: {
    type: String
  },
  url: {
    type: String,
    default:"/index"
  },
  change:{
    type: String,
    default:"pc"
  },
  returnUrl:{
    type: String,
    default:"pc"
  },
  cancelUrl:{
    type: String,
    default:"pc"
  }
});


// const clientId = 'AWwAGKZhvPE3xSgDh-gRH9sXwNMKDQSzr65ZwaUHp-U7CTbUk-FTnRRjlF0zTpz5LaeDz5rHgcaaekVm'; // 替换为您的 PayPal Client ID
const clientId = 'AWwAGKZhvPE3xSgDh-gRH9sXwNMKDQSzr65ZwaUHp-U7CTbUk-FTnRRjlF0zTpz5LaeDz5rHgcaaekVm'; // 替换为您的 PayPal Client ID

onMounted(async () => {
  await loadPayPalSDK();  // 等待 SDK 加载
  loadStyleSheet();
  initializePayPalButton();  // 初始化 PayPal 按钮
});

function loadPayPalSDK() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?components=buttons,card-fields&client-id=${clientId}`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
function initializePayPalButton() {
  if (window.paypal) {
    window.paypal.Buttons({
      createOrder: createOrderCallback,
      onApprove: (data) => onApproveCallback(data.orderID),
    }).render("#paypal-button-container");
    const cardField = window.paypal.CardFields({
      createOrder: createOrderCallback,
      onApprove: onApproveCallback,
    });
    if (cardField.isEligible()) {

      const nameField = cardField.NameField();
      nameField.render("#card-name-field-container");

      const numberField = cardField.NumberField();
      numberField.render("#card-number-field-container");

      const cvvField = cardField.CVVField();
      cvvField.render("#card-cvv-field-container");

      const expiryField = cardField.ExpiryField();
      expiryField.render("#card-expiry-field-container");

      document
          .getElementById("multi-card-field-button")
          .addEventListener("click", () => {
            cardField.submit().catch((error) => {
              resultMessage(
                  `Sorry, your transaction could not be processed...<br><br>${error}`,
              );
            });
          });
    } else {
      // Hides card fields if the merchant isn't eligible
      document.querySelector("#card-form").style = "display: none";
    }
  }
}

function loadStyleSheet() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'https://www.paypalobjects.com/webstatic/en_US/developer/docs/css/cardfields.css';
  document.head.appendChild(link);
}
//Close 3Ds Dialog
async function createOrderCallback() {
  try {
    tokenCookie.value=token
    const response = await axios.post("/api/admin/paypal/orders", JSON.stringify({
      amount: discountAmount.value,
      kind: props.kind,
      productId: props.productId,
      productName: props.productName,
      description: props.intro,
    }), {
      headers: {
        "Content-Type": "application/json",
        "change":props.change,
        "token": `Bearer ${token}`
      },
    });

    const orderData = await response.data;
    const message=orderData.message;


    if(orderData.code!=200) {
      $q.dialog({
        title: '通知',
        message: '支付失败.',
        ok: {
          push: true
        },
        cancel: {
          push: true,
          color: 'negative'
        },
      }).onOk(async () => {

      }).onCancel(() => {
        // //console.log('Cancel')
      });
    }
    if (orderData.data.id) {
      return orderData.data.id;
    } else {
      const errorDetail = orderData?.details?.[0];
      const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error);
    resultMessage(`Could not initiate PayPal Checkout...<br><br>${error}`);
  }
}

async function onApproveCallback(data, actions) {
  try {
    tokenCookie.value=token
    const response = await axios.get(`/api/admin/paypal/ordersCapture?orderId=${data}`, {
      headers: {
        "Content-Type": "application/json",
        "change":props.change,
        "token": `Bearer ${token}`

      },
    });

    const orderData = await response.data;
    // Three cases to handle:
    //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
    //   (2) Other non-recoverable errors -> Show a failure message
    //   (3) Successful transaction -> Show confirmation or thank you message
    const message=orderData.message;
    if(orderData.code==200) {
      $q.dialog({
        title: '通知',
        message: '支付完成.',
        ok: {
          push: true
        },
        cancel: {
          push: true,
          color: 'negative'
        },
      }).onOk(async () => {

      }).onCancel(() => {
        // //console.log('Cancel')
      });
    }else{
      $q.dialog({
        title: '通知',
        message: '支付失败.',
        ok: {
          push: true
        },
        cancel: {
          push: true,
          color: 'negative'
        },
      }).onOk(async () => {

      }).onCancel(() => {
        // //console.log('Cancel')
      });
    }

    const transaction =
        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
    const errorDetail = orderData?.details?.[0];

    if (errorDetail?.issue === "INSTRUMENT_DECLINED" && !data.card && actions) {
      return actions.restart();
    } else if (
        errorDetail ||
        !transaction ||
        transaction.status === "DECLINED"
    ) {
      let errorMessage;
      if (transaction) {
        errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
      } else if (errorDetail) {
        errorMessage = `${errorDetail.description} (${orderData.debug_id})`;
      } else {
        errorMessage = JSON.stringify(orderData);
      }

      throw new Error(errorMessage);
    } else {
      resultMessage(
          `Transaction ${transaction.status}: ${transaction.id}<br><br>See console for all available details`,
      );
    }
  } catch (error) {
    resultMessage(
        `Sorry, your transaction could not be processed...<br><br>${error}`,
    );
  }
}


// Example function to show a result to the user. Your site's UI library can be used instead.
function resultMessage(message) {
  const container = document.querySelector("#result-message");
  container.innerHTML = message;
}
const discountAmount=ref(props.amount);
async function getAmount() {
  // 滚动到顶部
  const response = await axios.post("/api/admin/paypal/getAmount",JSON.stringify({
    productId: props.productId,
    amount: props.amount,
    description: props.description,
    kind: props.kind,
    productName: props.productName,
  }),  {
    headers: {
      "Content-Type": "application/json",
      "change":props.change,
      "token": `Bearer ${token}`
    }
  })
  const data = response.data;
  if (data.code === 200) {
    discountAmount.value=data.data
  }
}
getAmount();
</script>

<style scoped>
/* 您的样式 */
.card_container {
  /* 样式定义 */
}
/* 其他样式 */
</style>
