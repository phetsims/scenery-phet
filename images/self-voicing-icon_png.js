/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPsAAAD7CAYAAACscuKmAAAACXBIWXMAABcRAAAXEQHKJvM/AAAUC0lEQVR4nO2dP4hVVx7HjxphsTGgRSwUo4WNsOMrZNFCA1pM4wZSOE1Y9QZSJJCkmCBp3OmyTCAKTrGBq1mSwlT50yRgIE6RsGAxUyisKVx3bCwiu2thM83yvcxxn+Obefec++edP58PPMZR33v3nnO/5/c7v/M7v2MAAAAgIba0dStFUew3xuzn4QBolQdlWT5o4wO9xV4UxZQx5nVjzAljzEn6F6BTbhljvjXGfOMrfmexF0VxzhjznjFmir4FmAjLxpgrZVl+7vLltcVeFIWs+Ke46gDBIAt/vizLW3UuaKzYi6J42Rhzfc1lB4DwkIX/oCzL/3iLfW1e/jXWHCB4ltes/PJGF7qh2NeE/pMx5mX6GSAKZNlf20jwI8WO0AGiZUPBvyD2tfXyJYQOEC0K3B1ZP4ffOuJuvkboAFGzf03Hz7Ft+JeiKP5sjJmhnwGiZ/9gMPjv0tLS3+2NPHPjcd8BkkNu/KvWnR924y8hdICkkJ7ftzdUiX0tceYc/QyQHO/ZG7KWHaEDpMnLa/tZnon9T3Q0QLL8UTe2dc2FZwcbQLpUW9C3InSA5JErP7WVwhMAWTA1KoMOANJjv8T+ezoWIH22kkgDkAe48QCZgNgBMuElOhomwY4dO8zevXtrffO9e/fooxZA7NAJEvLu3buf/dy1a5eTwDfi4cOH5unTp8/9/O2336qfsDmIHRojAR86dMjs27ev+nNTQW+G/Wx933rkAUj0eunPGgTg/yB2cEaWempqqhKcXrLYIWCvx/L48eNK9HotLS1VnkDObCmK4iey6GAcsqjHjx+vxNSl5e4SWfyff/7ZLC8v52j15xA7bIi14KdPn67m3Ckh4f/44485WXzEDi9y5MgRc+zYsepnDvzyyy+VxU886j/HnB2eITf9zJkzyVnxcWhg08taewk/RbDsmaPg2qlTp6pXKIG2SaPA3nfffZea6LHsOSOBy5Ij8ueRZ3P+/PmqbVISPWLPEM3FZ2ZmsnPXXbGil4sv0cc+p0fsGaHouh7eUQkpXSGX2Ga4DWe+mZppsMNZdzYTz/7U3/fhlai9Zmdnq0DejRs3oo3eI/ZMkEva9bxcwl5ZWXkuk62pMPR+OyiMGhzsYGDX/7tM8pGF11KkrLwCebFBgC5xJIALFy50lgijdWqJMKREFSt6TVe68mJ0zwsLCzFZedbZU6aLAJwebglbItcrdHTvEr0sctt5A2qL69evR9EOiD1R9IArACe3sy1kyTRnjTnjTO2iNmk7I1AuvebygYPYU0PBq3feeac1t10Cv3nzZnJbSOXeK4morQFR7TM/Px/yQIjYU0ICV9S4qduuB1bWSq/U88Y1OGqq04boFaC8evVqqAMjYk8FWSktqzXFRppDF/kokWqKoev3EVtbole7ycIHKPi5bYPBQIe+7Q/gYsCTNoQuoVy5cqX6ubq6GnRXyIP56KOPzIEDB577+z179piTJ09Wgrt//77TZ+o9Nuioz5H4fdi+fXt1DbLygQl+EbFHTlOh66HUEtL3338fhcuuKcqHH35odu7cueH/OXz4cDUn16qB68D15MmTKk4hoepzJF4fFPkPTPCIPWaaCl0ur5aOHj16FE0rHD16tJarLct84sSJysJLdK6oTRYXF80rr7xSWXofAhM8Yo+VJkK31lwWLHSXfT0uiTKyymoneQN37txx/i61ze3btxtZ+YAEv0jd+AjRA+QrdM1J5+bmsirPrOSiS5cueS9Hqs0uXrzoLdizZ88GUcoLyx4Zemi0ju5jZeS2f/nll9FZ82HknvtkwmmOrymA5uQ+olWbya235bFdUF/pu+UlTDAughsfE3WCU6PQAyaRx7h5Yz1yiTUX9xns9B4NFBLr3bt3vQY9WXldg+uAo+/W9EOCn9Bgi9hj4v3333e2Knbd12fOGiISioJnspS+KOCm98vC+wTv7PskXpdBR4O0XhPKpUfssaCEDwWbXAg4waMRErtiDrKuvktj8pJse/rEL9SmGkA1aLhcgwZrnzyAFkDsMaAH5O2333a60lSFbpFlbbo0ZoYOlvj111+d59Oa//sIXslAep/e3yOIPXTsPN0l3z11oVvs0pjuVwLytfIKumntXh6Da86BBCsr7eJ16ToPHjxYDVY9gthDZ3p62jkYdPny5Um4iRND9ypLKQG5Bi8tNmIu4cutdwmiyctwDdrpOnt25xcpSxUwdnOGC8qIc52D2u/p+lDGGJCFVxtcu3bNyTNSBVrtkXfpL/3fPiv8YNkDRuvpLhsylBGntXQXhjeV+FrF1FA7+Gxm0SCr9qwbQ5A3oelZT9F5MuhCZf2JpOPQQ+laLUUPWhv731NFWYquu9/kWbks58mT6KvaL2IPFFf3XW6nazRZDxpC3xzXflAfqC+6/A5fEHuAuFp134INuRzc2ASfWnVy512yFV372xfEHiAuI71E7jpPh+5Rn7i489qs0zWIPTBszfO6NKlqmvo6fBv4blzR+1wGYXlZvtVx6oLYA0Nljusid7HJVtVI6p1PFC2N+eJ65nvX1h2xB4Sta16Xpu6769wyNzQYNj3B1aWP2qzzPwrEHhAuAbOmVt2iaYAeyNRLRruiQVDVfJri0k/29JquIIMuIHREUV3aDMrZ8tG5Z89Z2jiQchglO9WNw0jsXU2vEHsguIzqivK2XVZq+LRUaBdNBVSaqk5Og8uA7wpufCC4ROB1HBPEhax7HTQgdLXmjtgDwaWDm0SIYTK4BPoQe+LU7WDNJ0M5Bx3q41ICC7EnjFy3usEx1sbjpW5MBLEnjEsUnCBavLgM1F2sjCD2AEDseeCSntxF6ixLbwFQd5tpl7nsLlOJ1OlqQFWsRUucdfpbfdH2lA2xB0DdOVoXgTk9eNpl18euq1iQIJVk1MVuQg3Ydfq7C8uOGx8RXVh2lb5C6M9jB8ALFy60/tl1+9BnH/04EHsA1HWf285fV/njvkoixYg2prgezDGOSe5BQOwBMKk5e9e7rFKgy/TVzeiiXBhizxis+njaFl3d4B9Lb9AqbGvNC8SeMazZj8fnlNdQQewZQ5Wa8aRUzBOxZ4wsuw41gNGobdrObXDZ8NQ2JNUEgFzFOuuqelDadr219VIPtNba9fm5Hxphi3j41uJv8zraBrEHgMTWRRJFXdqqZwfj6bpc9GbgxgdA3VGcpbL4qTuod+FVIPYAqNuxk7QK0A6TypY0iD0M6i7vyCrkPqeOGQ3Wk9zhiNgDYGVlpfZF4MrHi+sR3G2D2APApWMRe7zU7Tu58F1sZ0bsgVA3Gs4xy/FSd1NNV0t+iD0Q6opd83YqysSHSw4DJ8Ikjss6t/ZYNzmqeaPP1CCS+0Aiq6q+aFtwLvviu8p5QOyBoA6uW59M+9DbErvErYosuYvcIgusbEKJfn5+vpUlMPVpXRdeKzO48RlQ96QXPTxtVFDR57z77rsIfQRqk9nZ2VY+S3GWui58l5mMiD0gXFxH1UhrijyESabpho4E38ag6tJXTc+D3wzEHhASu0uCTdPIPJH98TQtS6XBou6A2sXpvMMg9sBwGdlnZmYyaZXJ0TRjMRSrbhB7eNQ92tesWXfKQHdLkwCd+sZlmtR1MRHEHhjKnHIRvCyHr/XhkMjx+B6PbWvP10V93nVNQMQeIC6lkPRQnT9/3usm9IBNskBD6KhtfF1r9YnLINxH+SvEHiCu1l2BNp9gmyyJ1pIR/IsoUKa28cG1P9TXfZy5T1JNoGikdznEQZZEonV9aCT4ubm5KtjXxvxfU4PYB48mlXu0jdXV0+qrqCViDxSJVgGbugKUy6hz23yzvpSRJ6HqM5pEoGXRJJRcK9e6tp/aqQ+rLrYNBoNzxpj9vXwbOHH//n1z4sQJs3379lpv27lzZ/XyDbxpnXdxcdEcOHCgUVWcw4cPV2mnCm6trq56f05sKO1Y914XDcoLCwt9tdEiYg8YPQSPHj0yR48erX2RNvXV1w3Vd9rIsMuDux4NFhqodP16pY48sOnpaae7/Oyzz/qc8iD20JFQJOA9e/bUvlJZ1aYbKuRVyEM4ePBg5S34II9EA5Xc2jt37kTeExujLLk333zT6T1q254PoEDsMXD37l0nd96szZ2bCv7Jkyfm9u3bldibbJbRtCBVwUvorgE5eU2ffPJJ31McxB4DPu68aUnw+m4bYZdb7zLgDCPB63M0gKSCj9BN/+67BbHHgsQu6yjRuCDBy5LILW+Cvl9WXhbeN3gnoadyGIWv0BV9n9BKBWKPCbnBmo+7ik0WWe9pmh6rQcMm+/gUvkzl5BnlJLzxxhvO79O9y6pPiEUy6CJDSzU+LqASdC5dutRK3XkFlrSen9JxxnWwuQw+yUfqM/XdJEHskSHreu3aNa/EGbngH3/8cSuVaWSllHnn4i3EbNXVZhosfdOSffusTXDjI0RzX7n0Cti5BszscpiSZ5pGg/V+zeNl4eXWb3Yt9mTUGJElV/kuH68ooP0HzNljpangJdS2LK0eZF3LRmvy+vfLly9Hl02nOIfc9pMnT3q9P7CNRog9ZpoI3jgWyhiHrkXegp3H63c95D/88IP54osvohO69qIr2u6SzDRMgDsKF9kIEzm25LEqoYZw6KP2f3ddXqlLNCdXtL1JIc5Qtw4j9gQITfAxopiDrHnTs/RCrhGA2BNBD9fFixcrwVMHvj5tidwMDbqTjrpvBGJPCD1k2pfe1uEGKaMMOEXZ2xoYFf9Q24cqdIPYISfsoQ9KMGpzuiORx1CsA7FD0liBK/DW9uk3Wnm4evVqNGW4EDt4o3muneva008n7cbKYuuaJG797Op4K1lyJQmF7LavB7GDMxKRSjCNEpJEr9fKysqzAaBLdC2y3vv27evlyGlZc6W+xpj6i9ihNsooO3v27Kb54VZww5VxZf0kfAlFxRXt78Pod2slZZ3Xi9Z6ELoGDTL6976XGWXJY035NYgd6iBRKXLte3Ksda1jRZt9vvrqq96qwHYFYodNUXBL1jzHZB27eSeVghuIHUbSZrJJbKQmcgtih+eQBVduuMtpNKmgxBjl9acmcgtih2fIkmtunpPLrqChBN7XeWuTBLFDKzu9YkJRf51Wo8BbTsdW9y52m64I9dGylFIy28YeQpjDvDxXgQ/Tu9hlPXIM+oSGrUeXMraabQony7YBbnwENDlkcSPampdrzqvItea7w9lsfU8J+s7ci5HexU5xBXdCnEvLLbYHHtjMt/UCk/htNtxwVpzNgnPBZt+ZoWw7ex49VrsevYudwgrxUzejzIq/7hzZTu+wyt2AGw+1sYHCrsSIyLsFscNY5DJrXh5DgQbYGMQOmxLjvm0YDWKHkcilvn79evJZZTmB2CNBwas+5rSKemtenmviScr0LnYSasLELqXFXJwBNidqy24t3fAa7CiGa6U1ZZwY7Hqyz1pyG/jMrWMogwzNiUrsEvXNmzcrkbskUrS5L9vF8g0XP+xrP4At/1RnoEl13zaMJgqxx7r0o+u2Gy90/Rp0+hC9yhtvdhSUrktJMTGfyQbuBC/22Gpzb4SmGapKKoHpGOAu04btMUTatjrs0YxKcYV8CFrsoZ+d5YNcZp8z2RQDcHG3bdsNxw5w1/Nma5937zJvlsBlCVO0QLqnhYUFp3vzDfbJo7BbPSFvehW7C0roSHk3k0QowQP0RZBitwUHUkf3Sb459EWQYs8psYO8c+iL4MSeW5URWxsNoGuCE3uObi3r3dAHwUXjc4wa17ln9hRAU4Ky7ONy3FOGpTHomqDErsqguYLYoWuCEnvOVUKpkApdE5wbnyssv0HX9JobLzFv5q7m7sZv1jZYfmhKr2LXEhPLTBujjSsAXRFsbjwAtAtiB8gExA6QCYgdIBMQO0AmIHaATEDsAJmA2AEyAbEDZAJiB8gExA6QCYgdIBMQO0AmIHaATEDsAJmA2AEyAbEDZAJiB8gExA6QCYgdIBMQO0AmIHaATEDsAJmA2AEyAbEDZAJiB8gExA6QCYgdIBMQO0AmIHaATEDsAJmA2AEyAbEDZAJiB8gExA6QCYgdIBMQO0AmIHaATEDsAJmA2AEyAbEDZAJiB8gExA6QCYgdIBMQuyM7duyI6noBLIjdkb1790Z1vQAWxA6QCYgdIBMQO0AmZCF25tkAmYi9zQj6oUOHWvssgD7BsjvC0hvESvJi3717N5YdssfkIPapqalWP09eggYQgNhIWuyy6KdPn279c48dO9b6ZwJ0TdJiP3PmjNm1a1cnn4s7D7GRrNiPHz9uTp061dnnz87OVqIHiIVtg8HgnDFmfyo9Jtd9enrazMzMdP5dsu4aVDSHX11dNY8fP+78OwE8WXwp1pZToGy9oPV3fS+NaZogD8J6EU+fPjUPHz6s/jw/P9/rtQBsRrRil6hDnDeHel0A5MYDZAJiB8gExA6QCYgdIBMQO0AmIHaATIh26e3evXvmrbfeCuBKAOIAyw6QCYgdIBMQO0AmIHaATJDYH9DZAOkjsf+LfgZIHyw7QB7cktiX6WyA5HmwRXdYFMW/jTEv098ASfKgLMtXbTT+G/oYIFkqfVuxf0s/AyTL33RjW+zdFUXxz5QKTwJAxXJZlkfMuqSaOdoGIDmu2BvaMnxnWHeApLhVluVr9obWp8uep68BkuGD4RvZNvzL0tLSg8FgoCW4P9DfAFEzV5bljeEb2DLqboqiWNIBqPQ1QJR8XpblC176RrveXiOzDiBKlte775aRYi/L8j8IHiA6bkm3a/p9gZFuvKUoCs3fPzXGnKPfAYLmclmWIy26ZVOxW4qieN0Yc538eYDg0K7VD8qyHJvyvq3OlS8tLf1jMBj81RjzOyL1AEEgV/0vWi4vy3L8dNsY8z8JR7ystDKbugAAAABJRU5ErkJggg==';
export default image;