type Id = string | number

interface Item {
  parent: Id;
  id: Id;
  [key: string | number | symbol]: unknown;
}

interface StoredItem {
  item: Item | null;
  children: Id[];
}

class TreeStore {
  items: {
    [key: Id]: StoredItem;
  };
  originalArray: Item[]

  constructor(items: Item[]) {
    this.originalArray = items
    this.items = {}
    items.forEach(item => {
      if(this.items[item.id] === undefined) {
        this.items[item.id] = {
          item: item,
          children: []
        }
      } else {
        this.items[item.id].item = item
      }
      if (item.parent !== 'root') {
        if (this.items[item.parent] !== undefined) {
            this.items[item.parent].children.push(item.id)
        } else {
            this.items[item.parent] = {
                item: null,
                children: [item.id]
            }
        }
      }
    })
  }

  getAll() {
    return this.originalArray
  }

  getItem(id: Id): Item {
    return this.items[id].item!
  }

  getChildren(id: Id): Item[] {
    const childrenIds = this.items[id].children
    return childrenIds.map(childId => this.getItem(childId))
  }

  getAllChildren(id: Id): Item[] {
    const currentChildren = this.getChildren(id)
    let res: Item[] = []
    currentChildren.forEach(child => {
      res = [...res, ...this.getChildren(child.id)]
    })
    return [...currentChildren, ...res]
  }

  getAllParents(id: Id): Item[] {
    const res: Item[] = []

    const currentItem = this.getItem(id)

    const getToRoot = (id: Id) => {
        const currentItem = this.getItem(id)
        res.push(currentItem)
        if(currentItem.parent !== 'root') {
            getToRoot(currentItem.parent)
        }
    }

    if(currentItem.parent !== 'root') {
        getToRoot(currentItem.parent)
    }

    return res
  }
}


const arr = [
  { id: 1, parent: 'root' },
  { id: 2, parent: 1, type: 'test' },
  { id: 3, parent: 1, type: 'test' },

  { id: 4, parent: 2, type: 'test' },
  { id: 5, parent: 2, type: 'test' },
  { id: 6, parent: 2, type: 'test' },

  { id: 7, parent: 4, type: null },
  { id: 8, parent: 4, type: null },
];

const t = new TreeStore(arr);

console.log(t.getAll())
console.log(t.getItem(7))
console.log(t.getChildren(4))
console.log(t.getChildren(5))
console.log(t.getChildren(2))
console.log(t.getAllChildren(2))
console.log('CHECK', t.getAllParents(7))

const arr2 = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 'root', type: 'test' },
    { id: 3, parent: 'root', type: 'test' },
]

const t2 = new TreeStore(arr2);

console.log(t2.getAll())
console.log(t2.getItem(1))
console.log(t2.getChildren(1))
console.log(t2.getChildren(2))
console.log(t2.getChildren(3))
console.log(t2.getAllChildren(1))
console.log(t2.getAllParents(1))