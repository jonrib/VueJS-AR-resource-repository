<template>
    <div class="float-left" :style="'width:100%;clear: both;padding-left:'+level*2+'%'">
        <p style="margin-bottom: 0px; float: left">
            <b>{{comment.userName == '' || comment.userName == 'anonymousUser' ? 'Anonymous' : comment.userName}}</b> commented at {{new Date(comment.date).getFullYear()+'-'+((new Date(comment.date).getMonth()+1+'').length == 1 ? '0'+(new Date(comment.date).getMonth()+1) : (new Date(comment.date).getMonth()+1))+'-'+((new Date(comment.date).getDate()+1+'').length == 1 ? '0'+(new Date(comment.date).getDate()+1) : (new Date(comment.date).getDate()+1))+' '+((new Date(comment.date).getHours()+1+'').length == 1 ? '0'+(new Date(comment.date).getHours()+1) : (new Date(comment.date).getHours()+1))+':'+((new Date(comment.date).getMinutes()+1+'').length == 1 ? '0'+(new Date(comment.date).getMinutes()+1) : (new Date(comment.date).getMinutes()+1))}}
        </p><br />
        <p style="margin-bottom: 0px; float: left">
            {{comment.message}}
        </p><br />
        <v-btn style="margin-bottom: 0px; float: left"
            text
            color="deep-blue accent-4"
        >
            Reply
        </v-btn>
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