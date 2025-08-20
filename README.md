# Zetrix Contract Development Toolkit


### ENV file creation

Create dotenv file and fill in the zetrix address, private key and node url information

```
PRIVATE_KEY=<PRIVATE_KEY>
ZTX_ADDRESS=<ZETRIX_ADDRESS>
NODE_URL=test-node.zetrix.com
```

### Install dependencies

Install all related dependencies. 

```
npm install
```

### Contract development

The smart contract components can be found in the **contracts** directory. If you change the filename(s), please modify the contract name in **scripts** directory as well.

### Manual for running script
```
npm run help
```

### Contract deployment
```
npm run deploy:<NAMING_REFER_TO_PACKAGE_JSON>
```

### Contract upgrade
```
npm run upgrade:<NAMING_REFER_TO_PACKAGE_JSON>
```

### Run test with coverage
```
npm run test-coverage tests/unit/<TEST_CASE>.js
```

### Run integration test
```
npm test tests/integration/<TEST_CASE>.js
```

### Development guides

The development of Zetrix smart contract is using Javascript ES5 which has less support on OOP concepts such as `class`. Hence, we imitate the OOP implementation by using functionalities available in the ES5.


#### Class
OOP implementation
```java
class Example {
    
    Example(String param) {
        // constructor
    }
}

Example exampleInst = new Example(param);
```

ES5 Javascript implementation
```javascript
const Example = function () {
    
    const self = this; // keep the context
    
    self.init = function (param) {
        // constructor
    };
};

const exampleInst = new Example();
exampleInst.init(param);
```

#### Managing private, protected and public method

OOP implementation
```java
class Example {
    
    private void privateMethod() {
        // private method
    }
    
    public void publicMethod() {
        // public method
    }

    protected void protectedMethod() {
        // protected method
    }
}
```

ES5 Javascript implementation
```javascript
const Example = function () {
    
    const self = this; // keep the context

    self.p = {/*protected function*/};
    
    const _privateMethod = function () {
        // private method
    };
    
    self.publicMethod = function () {
        // public method
    };
    
    self.p.protectedMethod = function () {
        // protected method : this method is similar to the public method, but we just defined in `p` nameclass to differentiate  
    };
};
```

#### Inheritance and override

OOP implementation
```java
class ExampleParent {
    
    public void parentMethod1() {
        
    }

    public void parentMethod2() {

    }
    
    public void parentMethod3(int a, int b) {
        
    }
}

class ExampleChild extends ExampleParent {
    
    @Override
    public void parentMethod1() {
        // Override parent method
        // Do something else and continue with original parentMethod
        super.parentMethod1();
    }

    @Override
    public void parentMethod2() {
        // Override parent method
    }
    
    private void childMethod(int a, int b) {
        // Use parent function in child wrapper
        return super.parentMethod3(a, b);
    } 
}
```

ES5 Javascript implementation
```javascript
const ExampleParent = function () {

    const self = this; // keep the context

    self.p = {/*protected function*/};
    
    self.p.parentMethod1 = function () {

    };
    
    self.p.parentMethod2 = function() {
        
    };
    
    self.parentMethod3 = function(a, b) {
        
    };
};

const ExampleChild = function () {

    const self = this;

    ExampleParent.call(self); // Inherit
    
    const _parentMethod1 = self.p.parentMethod1
    self.p.parentMethod1 = function(){
        // Override parent method
        // Do something else and continue with original parentMethod
        _parentMethod1.call(self);
    };
    
    self.p.parentMethod2 = function() {
        // Override parent method
    };

    const _childMethod = function() {
        // Use parent function in child wrapper
        return self.parentMethod3(a, b);
    };

};
```