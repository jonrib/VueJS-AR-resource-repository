<template>
    <div class="float-left" :style="'clear: both;padding-left:'+level*5+'%'">
        <v-card>
            <v-card-text>
                <p class="text--primary" style="width:100%">
                    {{comment.userName == '' || comment.userName == 'anonymousUser' ? 'Anonymous' : comment.userName}} comments:
                </p>
                <div class="text--primary" style="width:100%">
                    {{comment.message}}
                </div>
            </v-card-text>
            <v-card-actions>
            <v-btn
                text
                color="deep-blue accent-4"
            >
                Reply
            </v-btn>
            </v-card-actions>
        </v-card>
        <Comment v-for="reply in replies" v-bind:key="reply.id" :replies="reply.replies" :comment="reply" :level="level+1"/>
    </div>
</template>
<script>
  export default {
    data: () => ({
      showSuccess: false,
	  showFail: false,
	  successText: '',
	  failText: '',
	  path: '',
	  dialog: false,
	  dialogDelComm: false,
	  commToDel: '',
    }),
    props:{
        replies: {
            type: Array,
            required: true
        },
        comment: {
            type: Object,
            required: true
        },
        level:{
            type: Number,
            required: true
        }
    },
	created: function(){
		
    },
    beforeCreate: function () {
		this.$options.components.Comment = require('./comment.vue').default
	},
    methods: {
      validate () {
        
	  },
    },
  }
</script>