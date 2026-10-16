R = [
("""      speedTile(pusher + (bothOwn ? ' is shoved back at' : !movB ? ' is thrown back at' : ' recoils at'), r.vA, ''),""",
"""      // (Both at once with the power on: a shover the other's shove can't move doesn't move at all; review round 1 of pull request 4)
      bothOwn && !movA ? tile(pusher + ' moves', 'not at all', (r.shover === 'A' ? cR : cO).anchor === 'bolted' ? 'bolted' : 'his footing holds') : speedTile(pusher + (bothOwn ? ' is shoved back at' : !movB ? ' is thrown back at' : ' recoils at'), r.vA, ''),"""),
("""        : act === 'wrestle' && state.wrestleMove === 'shove' && e === 'ground' && state.ownRecoil ? 'tears the rock out around ' + (state.wrestleWho === 'rex' ? 'Ollie’s bolts' : state.wrestleWho === 'ollie' ? 'Rex’s bolts' : 'the bolts of the one shoved')""",
"""        : act === 'wrestle' && state.wrestleMove === 'shove' && e === 'ground' && state.ownRecoil ? 'tears the rock out around ' + (state.wrestleWho === 'rex' ? 'Ollie’s bolts' : state.wrestleWho === 'ollie' ? 'Rex’s bolts' : 'the bolts of the one shoved')
          // (the shoving match with one of them bolted and the power on: the other's push tears the rock out around his bolts)
          : act === 'wrestle' && state.wrestleMove === 'push' && e === 'ground' && state.ownRecoil && (state.anchor === 'bolted') !== (state.oAnchor === 'bolted') ? 'tears the rock out around ' + (state.anchor === 'bolted' ? 'Rex’s' : 'Ollie’s') + ' bolts'"""),
]
