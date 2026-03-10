import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

actor {
  type Product = {
    id : Nat;
    category : Text;
    containsAlcohol : Bool;
  };

  type OrderItem = {
    productId : Nat;
    quantity : Nat;
  };

  let products = Map.empty<Nat, Product>();

  public shared ({ caller }) func addProduct(id : Nat, category : Text, containsAlcohol : Bool) : async () {
    let product : Product = {
      id;
      category;
      containsAlcohol;
    };
    products.add(id, product);
  };

  public shared ({ caller }) func verifyAgeAndCheckout(cartItems : [(Nat, Nat)], isAgeVerified : Bool) : async () {
    let needsVerification = cartItems.any(func(item) { containsAlcohol(item.0) });

    if (needsVerification and not isAgeVerified) {
      Runtime.trap("Age verification required for checkout.");
    };
  };

  private func containsAlcohol(productId : Nat) : Bool {
    switch (products.get(productId)) {
      case (?product) { product.containsAlcohol };
      case (null) { false };
    };
  };
};
