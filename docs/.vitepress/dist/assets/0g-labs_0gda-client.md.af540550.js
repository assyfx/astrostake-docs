import{_ as s,c as a,o as n,a as l}from"./app.dd4d1028.js";const E=JSON.parse('{"title":"0G DA Client Setup Guide","description":"","frontmatter":{},"headers":[{"level":2,"title":"Requirements","slug":"requirements","link":"#requirements","children":[]},{"level":2,"title":"Install","slug":"install","link":"#install","children":[]},{"level":2,"title":"Stop node","slug":"stop-node","link":"#stop-node","children":[]}],"relativePath":"0g-labs/0gda-client.md"}'),e={name:"0g-labs/0gda-client.md"},p=l(`<h1 id="_0g-da-client-setup-guide" tabindex="-1">0G DA Client Setup Guide <a class="header-anchor" href="#_0g-da-client-setup-guide" aria-hidden="true">#</a></h1><h2 id="requirements" tabindex="-1">Requirements <a class="header-anchor" href="#requirements" aria-hidden="true">#</a></h2><ul><li>Memory: 8 GB RAM</li><li>CPU: 2 Cores</li><li>Disk: -</li><li>Bandwidth: 100 Mbps (Download / Upload)</li></ul><h2 id="install" tabindex="-1">Install <a class="header-anchor" href="#install" aria-hidden="true">#</a></h2><ol><li><strong>Install necessary packages</strong></li></ol><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">sudo apt-get update</span></span>
<span class="line"><span style="color:#A6ACCD;">sudo apt-get install cmake</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ol start="2"><li><strong>Install go</strong></li></ol><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">cd $HOME &amp;&amp; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">ver=&quot;1.22.0&quot; &amp;&amp; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">wget &quot;https://golang.org/dl/go$ver.linux-amd64.tar.gz&quot; &amp;&amp; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">sudo rm -rf /usr/local/go &amp;&amp; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">sudo tar -C /usr/local -xzf &quot;go$ver.linux-amd64.tar.gz&quot; &amp;&amp; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">rm &quot;go$ver.linux-amd64.tar.gz&quot; &amp;&amp; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">echo &quot;export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin&quot; &gt;&gt; ~/.bash_profile &amp;&amp; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">source ~/.bash_profile &amp;&amp; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">go version</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ol start="3"><li><strong>Download and run Docker</strong></li></ol><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">curl -fsSL https://get.docker.com -o get-docker.sh &amp;&amp; sh get-docker.sh</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">sudo usermod -aG docker $USER &amp;&amp; newgrp docker</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">sudo systemctl enable docker.service &amp;&amp; sudo systemctl enable containerd.service</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ol start="4"><li><strong>Clone 0G DA Client</strong></li></ol><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">git clone https://github.com/0glabs/0g-da-client.git</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ol start="5"><li><strong>Build docker image</strong></li></ol><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">cd 0g-da-client</span></span>
<span class="line"><span style="color:#A6ACCD;">docker build -t da-client -f combined.Dockerfile .</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ol start="6"><li>Create environment file</li></ol><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">nano envfile.env</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">Edit env file</p><p>Please check and enter <code>COMBINED_SERVER_PRIVATE_KEY</code> <code>BATCHER_ENCODER_ADDRESS</code></p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;"># envfile.env</span></span>
<span class="line"><span style="color:#A6ACCD;">COMBINED_SERVER_CHAIN_RPC=https://evmrpc-testnet.0g.ai</span></span>
<span class="line"><span style="color:#A6ACCD;">COMBINED_SERVER_PRIVATE_KEY=YOUR_PRIVATE_KEY</span></span>
<span class="line"><span style="color:#A6ACCD;">ENTRANCE_CONTRACT_ADDR=0x857C0A28A8634614BB2C96039Cf4a20AFF709Aa9</span></span>
<span class="line"><span style="color:#A6ACCD;">COMBINED_SERVER_RECEIPT_POLLING_ROUNDS=180</span></span>
<span class="line"><span style="color:#A6ACCD;">COMBINED_SERVER_RECEIPT_POLLING_INTERVAL=1s</span></span>
<span class="line"><span style="color:#A6ACCD;">COMBINED_SERVER_TX_GAS_LIMIT=2000000</span></span>
<span class="line"><span style="color:#A6ACCD;">COMBINED_SERVER_USE_MEMORY_DB=true</span></span>
<span class="line"><span style="color:#A6ACCD;">COMBINED_SERVER_KV_DB_PATH=/runtime/</span></span>
<span class="line"><span style="color:#A6ACCD;">COMBINED_SERVER_TimeToExpire=2592000</span></span>
<span class="line"><span style="color:#A6ACCD;">DISPERSER_SERVER_GRPC_PORT=51001</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_DASIGNERS_CONTRACT_ADDRESS=0x0000000000000000000000000000000000001000</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_FINALIZER_INTERVAL=20s</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_CONFIRMER_NUM=3</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_MAX_NUM_RETRIES_PER_BLOB=3</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_FINALIZED_BLOCK_COUNT=50</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_BATCH_SIZE_LIMIT=500</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_ENCODING_INTERVAL=3s</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_ENCODING_REQUEST_QUEUE_SIZE=1</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_PULL_INTERVAL=10s</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_SIGNING_INTERVAL=3s</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_SIGNED_PULL_INTERVAL=20s</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_EXPIRATION_POLL_INTERVAL=3600</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_ENCODER_ADDRESS=DA_IP:PORT</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_ENCODING_TIMEOUT=300s</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_SIGNING_TIMEOUT=60s</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_CHAIN_READ_TIMEOUT=12s</span></span>
<span class="line"><span style="color:#A6ACCD;">BATCHER_CHAIN_WRITE_TIMEOUT=13s</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div></div><ol start="7"><li><strong>Run docker container</strong></li></ol><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">docker run -d --env-file envfile.env --name da-client -v ./run:/runtime -p 51001:51001 da-client</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ol start="8"><li><strong>Check logs</strong></li></ol><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">docker logs -f da-client</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="stop-node" tabindex="-1">Stop node <a class="header-anchor" href="#stop-node" aria-hidden="true">#</a></h2><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">docker stop da-client</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div>`,25),o=[p];function t(c,i,r,C,A,d){return n(),a("div",null,o)}const u=s(e,[["render",t]]);export{E as __pageData,u as default};
