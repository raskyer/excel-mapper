<script>
  export let id;
  export let title;
  export let cell;
  export let onChange;
  export let cells;
</script>

<div class="form-group">
  <label for={id}>{title} :</label>
  <select
    id={id}
    class={'form-control ' + (cell === null ? 'is-invalid' : 'is-valid')}
    bind:value={cell}
    on:change={onChange}
    required>
    <option value={null}>Choissisez...</option>
    {#each cells as cell, i}
      <option value={i}>{cell}</option>
    {/each}
  </select>
</div>
