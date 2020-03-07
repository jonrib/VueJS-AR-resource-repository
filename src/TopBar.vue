<template>
  <div>
    <md-tabs md-sync-route>
      <md-tab id="tab-home" md-label="Home" to="/welcome" exact></md-tab>
      <md-tab id="tab-resources" md-label="AR resources" to="/resources"></md-tab>
      <md-tab id="tab-tasks" md-label="Tasks" to="/tasks"></md-tab>
    </md-tabs>
    
  </div>
</template>

<script>
  export default {
    name: 'TabRouter'
  }
</script>