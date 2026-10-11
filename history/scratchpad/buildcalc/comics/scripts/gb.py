import json,sys,urllib.request,urllib.parse
q=sys.argv[1]; n=int(sys.argv[2]) if len(sys.argv)>2 else 10
url="https://www.googleapis.com/books/v1/volumes?"+urllib.parse.urlencode({'q':q,'maxResults':n})
d=json.load(urllib.request.urlopen(url))
print('total',d.get('totalItems'))
for it in d.get('items',[]):
    v=it['volumeInfo']
    print(it['id'],'|',v.get('title'),'|',v.get('subtitle'),'|',v.get('publisher'),'|',v.get('publishedDate'))
    print('   snippet:',it.get('searchInfo',{}).get('textSnippet'))
