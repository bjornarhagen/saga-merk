"""Check only public build output under a restricted container runtime."""
import pathlib, subprocess, sys, time, urllib.request, urllib.error
image = sys.argv[1]
container = subprocess.check_output(['docker','run','-d','--read-only','--user','1000:1000','--cap-drop=ALL','--security-opt=no-new-privileges','--tmpfs','/tmp:rw,noexec,nosuid,size=16m','-p','127.0.0.1::8080',image],text=True).strip()
try:
    port = subprocess.check_output(['docker','port',container,'8080'],text=True).strip().split(':')[-1]
    base = 'http://127.0.0.1:'+port
    for attempt in range(40):
        try:
            with urllib.request.urlopen(base+'/healthz',timeout=2) as response:
                assert response.read()==b'ok\n'
            break
        except (OSError, AssertionError):
            if attempt==39: raise
            time.sleep(.25)
    for url, file in [('/', 'index.html'),('/dist/saga-merk-bookmarklet.txt','dist/saga-merk-bookmarklet.txt'),('/dist/saga-merk.js','dist/saga-merk.js')]+[('/'+str(p),str(p)) for p in pathlib.Path('assets').iterdir() if p.is_file()]:
        with urllib.request.urlopen(base+url) as response:
            assert response.read()==pathlib.Path(file).read_bytes(),url
            assert response.headers['X-Content-Type-Options']=='nosniff'
    for url in ['/src/saga-merk.js','/.git/config','/.local-history/','/unknown']:
        try: urllib.request.urlopen(base+url)
        except urllib.error.HTTPError as error: assert error.code==404
        else: raise AssertionError('Unexpected public file: '+url)
    print('PASS: exact static output, health endpoint, restricted runtime and private-file exclusions.')
finally:
    subprocess.run(['docker','rm','-f',container],check=True,stdout=subprocess.DEVNULL)
