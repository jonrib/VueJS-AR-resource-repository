<template>
    <div>
         <v-alert type="success" v-if="showSuccess" dismissible transition="fade-transition">
		  {{ successText }}
	  </v-alert>
	  <v-alert type="error" v-if="showFail" dismissible transition="fade-transition">
		  {{ failText }}
	  </v-alert>
      <v-dialog
      v-model="dialogReply"
      max-width="450"
    >
      <v-card>
        <v-card-title class="headline">Write your reply</v-card-title>

        <v-textarea
		label="Comment"
		v-model="commentReply"
		style="padding: 20px"
		></v-textarea>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="darken-1"
            text
            @click="commentReply = ''; dialogReply = false"
          >
            Close
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="postReply(); dialogReply = false; commentReply = ''"
          >
            Post reply
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
        <v-dialog
        v-model="dialog"
        max-width="450"
        >
        <v-card>
            <v-card-title class="headline">Permanently delete comment?</v-card-title>

            <v-card-text>
            WARNING: comment and all replies will be deleted premenantely!
            </v-card-text>

            <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
                color="darken-1"
                text
                @click="dialog = false"
            >
                Disagree
            </v-btn>

            <v-btn
                color="red darken-1"
                text
                @click="deleteComment(); dialog = false"
            >
                Agree
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
        <div class="float-left" :style="'width:100%;clear: both;padding-left:'+level*2+'%'">
            <p style="margin-bottom: 0px; float: left">
                <b>{{comment.userName == '' || comment.userName == 'anonymousUser' ? 'Anonymous' : comment.userName}}</b> commented at {{new Date(comment.date).getFullYear()+'-'+((new Date(comment.date).getMonth()+1+'').length == 1 ? '0'+(new Date(comment.date).getMonth()+1) : (new Date(comment.date).getMonth()+1))+'-'+((new Date(comment.date).getDate()+1+'').length == 1 ? '0'+(new Date(comment.date).getDate()+1) : (new Date(comment.date).getDate()+1))+' '+((new Date(comment.date).getHours()+1+'').length == 1 ? '0'+(new Date(comment.date).getHours()+1) : (new Date(comment.date).getHours()+1))+':'+((new Date(comment.date).getMinutes()+1+'').length == 1 ? '0'+(new Date(comment.date).getMinutes()+1) : (new Date(comment.date).getMinutes()+1))}}
            </p><br />
            <p style="margin-bottom: 0px; float: left">
                {{comment.message}}
            </p><br />
            <v-btn
                color="indigo"
                fab
                small
                class="float-right"
                @click.stop="idToDel = comment.id; dialog = true"
                style="margin-right:5px;"
                v-if="canDeleteComment(comment.userName)"
            >
                <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn style="margin-bottom: 0px; float: left"
                text
                color="deep-blue accent-4"
                @click="dialogReply = true;"
            >
                Reply
            </v-btn>
            <Comment :resourceEntryId="resourceEntryId" v-for="reply in replies" v-bind:key="reply.id" :replies="reply.replies" :comment="reply" :level="level+1"/>
        </div>
    </div>
</template>
<script>
  export default {
    data: () => ({
      dialogReply: false,
      idToReplyTo:'',
      commentReply: '',
      showSuccess: false,
      showFail: false,
      successText: '',
      failText: '',
      dialog: false,
      idToDel: '',
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
        },
        resourceEntryId:{
            type: String,
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
      canDeleteComment (author){
          for (var i = 0; i < this.getLoggedInData().Role.length; i++){
			if (this.getLoggedInData().Role[i].name == 'Admin')
				return true;
		  }
          return author == this.getLoggedInData().sub && author != 'anonymousUser';
      },
      deleteComment (){
          this.axios.delete(this.globalBackEndPath+"/resourceEntries/"+this.resourceEntryId+"/comments/"+this.idToDel).then(()=>{
			  this.successText = "Success!";
			  this.showSuccess = true;
              this.comment['userName'] = "DELETED!";
              this.comment['message'] = "DELETED!";
		   }).catch((error)=>{this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});
      },
      postReply(){
		  let commPayload = {message: this.commentReply, userName: this.getLoggedInData().sub};
		  this.axios.post(this.globalBackEndPath+"/resourceEntries/"+this.resourceEntryId+"/comments/"+this.comment.id, commPayload).then((resp)=>{
			  this.successText = "Success!";
			  this.showSuccess = true;
			  setTimeout(()=>{this.showSuccess=false},3000);
			  this.replies.push({id: resp.data, message: commPayload.message, userName: this.getLoggedInData().sub, date: new Date(),replies:[]});
		   }).catch((error)=>{this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});
	  },
    },
  }
</script>