<script>
  export let data;
</script>

<table class="table table-bordered table-hover table-sm">
  <caption>Result</caption>
  <thead class="thead-dark">
    <tr>
      {#each data[0] as header}
        <th scope="col">{header}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each data.slice(1) as row}
      <tr>
        {#each row as col}
          <td>{col}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
