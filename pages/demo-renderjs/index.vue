<template>
  <view class="container">
    <view
      id="renderJS"
      class="renderJS"
      :event="event"
      :change:event="renderJS.handleEvent"
    ></view>
  </view>
</template>

<script module="renderJS" lang="renderjs">
	export default {
		data() {
      return {}
		},
    created() {
    },
		methods: {
      handleEvent(event) {
        switch (event.type) {
          case 'deposit':
            // do some thing by event
            const res = {
              // ...
            };
            this.$ownerInstance.callMethod('eventCallBack', { ...event, res });
            break;
        
          default:
            break;
        }
			},
		}
	}
</script>

<script>
	export default {
		data() {
			return {
        event: {},
      }
    },
    onLoad() {
      this.event = {
        type: 'deposit',
        payload: { module: 'stake', func: 'deposit', args: [this.data.staking, this.data.duration] }
      };
    },
    methods: {
      eventCallBack({ type, payload, res }) {
        switch (type) {
          case 'deposit':
            // do some thing by res
            break;
          default:
            break;
        }
      }
    }
  }
</script>