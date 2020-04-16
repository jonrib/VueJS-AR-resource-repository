<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
	<ul>
		<li>Navigate to <a href="/resources">"Resources"</a> to view available resources</li>
		<li>Navigate to <a href="/login">"Login"</a> to login</li>
		<li>Navigate to <a href="/registration">"Register"</a> to register an account</li>
	</ul>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  data () {
    return {
      msg: 'Artificial reality repository application'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
