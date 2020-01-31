<script>
  export let id;
  export let title;
  export let sheet;
  export let onChange;
  export let sheets;
</script>

<div class="form-group">
  <label for={id}>{title} :</label>
  <select
    id={id}
    class={'form-control ' + (sheet === null ? 'is-invalid' : 'is-valid')}
    bind:value={sheet}
    on:change={onChange}
    required>
    <option value={null}>Choissisez...</option>
    {#each sheets as sheet}
      <option value={sheet}>{sheet}</option>
    {/each}
  </select>
</div>
