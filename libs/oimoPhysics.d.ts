/**
 * OIMO物理
 */
declare module OIMO {

    export const REVISION: string;

    // BroadPhase
    export const BR_NULL: number;
    export const BR_BRUTE_FORCE: number;
    export const BR_SWEEP_AND_PRUNE: number;
    export const BR_BOUNDING_VOLUME_TREE: number;

    // Body type
    export const BODY_NULL: number;
    export const BODY_DYNAMIC: number;
    export const BODY_STATIC: number;
    export const BODY_KINEMATIC: number;
    export const BODY_GHOST: number;

    // Shape type
    export const SHAPE_NULL: number;
    export const SHAPE_SPHERE: number;
    export const SHAPE_BOX: number;
    export const SHAPE_CYLINDER: number;
    export const SHAPE_PLANE: number;
    export const SHAPE_PARTICLE: number;
    export const SHAPE_TETRA: number;

    // Joint type
    export const JOINT_NULL: number;
    export const JOINT_DISTANCE: number;
    export const JOINT_BALL_AND_SOCKET: number;
    export const JOINT_HINGE: number;
    export const JOINT_WHEEL: number;
    export const JOINT_SLIDER: number;
    export const JOINT_PRISMATIC: number;

    // AABB aproximation
    export const AABB_PROX: number;

    export function printError(clazz: any, msg: any);

    class InfoDisplay {
        parent: World;
        infos: Float32Array;

        fps: number;

        broadPhaseTime: number;
        narrowPhaseTime: number;
        solvingTime: number;
        totalTime: number;
        updateTime: number;
        MaxBroadPhaseTime: number;
        MaxNarrowPhaseTime: number;
        MaxSolvingTime: number;
        MaxTotalTime: number;
        MaxUpdateTime: number;

        constructor(world: World);

        setTime(n: number);
        resetMax();
        calcBroadPhase();
        calcNarrowPhase();
        calcEnd();
        upfps();
        show();
        toArray(): number[];

    }

    export class Vec3 {
        constructor(x?: number, y?: number, z?: number);
        x: number;
        y: number;
        z: number;

        Vec3: boolean;

        set(x: number, y: number, z: number): this;

        add(a: Vec3, b: Vec3): this;

        addVectors(a: Vec3, b: Vec3): this;

        addEqual(v: Vec3): this;

        sub(a: Vec3, b: Vec3): this;

        subVectors(a: Vec3, b: Vec3): this;

        subEqual(v: Vec3): this;

        scale(v: Vec3, s: number): this;

        scaleEqual(s: number): this;

        multiply(v: Vec3): this;

        addScaledVector(v: Vec3, s: number): this;

        subScaledVector(v: Vec3, s: number): this;


        cross(a: Vec3, b?: Vec3): this;
        crossVectors(a: Vec3, b: Vec3): this;

        tangent(v: Vec3): this;
        invert(v: Vec3): this;

        negate(): this;
        dot(v: Vec3): number;
        addition(): number;

        lengthSq(): number;
        length(): number;

        copy(v: Vec3): this;

        applyMatrix3(m: Mat33, transpose: boolean): this;

        applyQuaternion(q: Quat): this;

        testZero(): boolean;
        testDiff(v: Vec3): boolean;
        equals(v: Vec3): boolean;
        clone(): Vec3;
        toString(): string;
        multiplyScalar(s: number): this;
        divideScalar(s: number): this;

        normalize(): this;

        toArray(array: number[], offset: number): void;
        fromArray(array: number[], offset: number): this;

    }

    export class Quat {
        constructor(x?: number, y?: number, z?: number, w?: number);
        Quat: boolean;
        set(x: number, y: number, z: number, w: number): this;

        addTime(v: Vec3, t: number): this;
        multiply(p: Quat, q: Quat): this;
        multiplyQuaternions(a: Quat, b: Quat): this;
        setFromUnitVectors(v1: Vec3, v2: Vec3): this;
        arc(v1: Vec3, v2: Vec3): this;

        normalize(): this;

        inverse(): this;

        invert(q: Quat): this;

        conjugate(): this;

        length(): number;

        lengthSq(): number;
        copy(q: Quat): this;
        clone(q: Quat): Quat;


        testDiff(q: Quat): boolean;
        equals(q: Quat): boolean;
        toString(): string;
        setFromEuler(x: number, y: number, z: number): this;

        setFromAxis(axis: Vec3, rad: number): this;

        setFromMat33(m: Mat33): this;

        toArray(array: number[], offset: number): void;
        fromArray(array: number[], offset: number): this;

    }

    export class Mat33 {
        constructor();
        Mat33: boolean;

        elements: number[];

        set(e00: number, e01: number, e02: number,
            e10: number, e11: number, e12: number,
            e20: number, e21: number, e22: number): this;

        add(a: Mat33, b: Mat33): this;

        addMatrixs(a: Mat33, b: Mat33): this;

        addEqual(m: Mat33): this;

        sub(a: Mat33, b: Mat33): this;

        subMatrixs(a: Mat33, b: Mat33): this;

        subEqual(m: Mat33): this;

        scale(m: Mat33, s: number): this;
        scaleEqual(s: number): this;

        multiplyMatrices(m1: Mat33, m2: Mat33, transpose: boolean): this;
        transpose(m: Mat33): this;

        setQuat(q: Quat): this;

        invert(m: Mat33): this;

        addOffset(m: Mat33, v: Vec3): this;

        subOffset(m: Mat33, v: Vec3): this;

        multiplyScalar(s: number): this;
        identity(): this;

        clone(): Mat33;

        copy(m: Mat33): this;

        determinant(): number;

        toArray(array: number[], offset: number): number[];
        fromArray(array: number[], offset: number): this;


    }

    export class Math {
        /**
         * Returns the absolute value of a number (the value without regard to whether it is positive or negative).
         * For example, the absolute value of -5 is the same as the absolute value of 5.
         * @param x A numeric expression for which the absolute value is needed.
         */
        static abs(x: number): number;
        /**
         * Returns the arc cosine (or inverse cosine) of a number.
         * @param x A numeric expression.
         */
        static acos(x: number): number;
        /**
         * Returns the arcsine of a number.
         * @param x A numeric expression.
         */
        static asin(x: number): number;
        /**
         * Returns the arctangent of a number.
         * @param x A numeric expression for which the arctangent is needed.
         */
        static atan(x: number): number;
        /**
         * Returns the angle (in radians) from the X axis to a point.
         * @param y A numeric expression representing the cartesian y-coordinate.
         * @param x A numeric expression representing the cartesian x-coordinate.
         */
        static atan2(y: number, x: number): number;
        /**
         * Returns the smallest number greater than or equal to its numeric argument.
         * @param x A numeric expression.
         */
        static ceil(x: number): number;
        /**
         * Returns the cosine of a number.
         * @param x A numeric expression that contains an angle measured in radians.
         */
        static cos(x: number): number;
        /**
         * Returns e (the base of natural logarithms) raised to a power.
         * @param x A numeric expression representing the power of e.
         */
        static exp(x: number): number;
        /**
         * Returns the greatest number less than or equal to its numeric argument.
         * @param x A numeric expression.
         */
        static floor(x: number): number;
        /**
         * Returns the natural logarithm (base e) of a number.
         * @param x A numeric expression.
         */
        static log(x: number): number;
        /**
         * Returns the larger of a set of supplied numeric expressions.
         * @param values Numeric expressions to be evaluated.
         */
        static max(...values: number[]): number;
        /**
         * Returns the smaller of a set of supplied numeric expressions.
         * @param values Numeric expressions to be evaluated.
         */
        static min(...values: number[]): number;
        /**
         * Returns the value of a base expression taken to a specified power.
         * @param x The base value of the expression.
         * @param y The exponent value of the expression.
         */
        static pow(x: number, y: number): number;
        /** Returns a pseudorandom number between 0 and 1. */
        static random(): number;
        /**
         * Returns a supplied numeric expression rounded to the nearest number.
         * @param x The value to be rounded to the nearest number.
         */
        static round(x: number): number;
        /**
         * Returns the sine of a number.
         * @param x A numeric expression that contains an angle measured in radians.
         */
        static sin(x: number): number;
        /**
         * Returns the square root of a number.
         * @param x A numeric expression.
         */
        static sqrt(x: number): number;
        /**
         * Returns the tangent of a number.
         * @param x A numeric expression that contains an angle measured in radians.
         */
        static stan(x: number): number;

        static degtorad: number;
        static radtodeg: number;
        static PI: number;
        static TwoPI: number;
        static PI90: number;
        static PI270: number;

        static INF: number;
        static EPZ: number;
        static EPZ2: number;

        static lerp(x: number, y: number, t: number): number;

        static randInt(low: number, high: number): number;

        static rand(low: number, high: number): number;

        static generateUUID(): string;

        static int(x: number): number;

        static fix(x: number, n: number): number;

        static clamp(value: number, min: number, max: number): number;
        static distance(p1: number[], p2: number[]): number;

        static acosClamp(cos: number): number;

        static distanceVector(v1: Vec3, v2: Vec3): number;
        static dotVectors(v1: Vec3, v2: Vec3): number;


    }

    export class AABB {
        constructor(minX: number, maxX: number,
            minY: number, maxY: number,
            minZ: number, maxZ: number);

        AABB: boolean;

        elements: Float32Array;

        set(minX: number, maxX: number,
            minY: number, maxY: number,
            minZ: number, maxZ: number): this;

        intersectTest(aabb: AABB): boolean;

        intersectTestTwo(aabb: AABB): boolean;

        clone(): AABB;
        copy(aabb: AABB, margin?: number);

        fromArray(array: number[]): this;

        combine(aabb1: AABB, aabb2: AABB): this;

        surfaceArea(): number;

        intersectsWithPoint(x: number, y: number, z: number): boolean;

        setFromPoints(arr: Vec3[]): void;

        makeEmpty(): void;
        expandByPoint(v: Vec3): void;

        expandByScalar(s: number): void;

    }

    export class ShapeConfig {
        relativePosition: Vec3;
        relativeRotation: Mat33;

        density: number;
        restitution: number;
        friction: number;

        belongsTo: number;
        collidesWith: number;


    }

    export class JointConfig {
        scale: number;
        invScale: number;
        body1: RigidBody;
        body2: RigidBody;
        localAnchorPoint1: Vec3;
        localAnchorPoint2: Vec3;
        localAxis1: Vec3;
        localAxis2: Vec3;
        allowCollision: boolean;

    }

    export class MassInfo {
        mass: number;
        inertia: Mat33;
    }

    export class Proxy {
        shape: Shape;
        aabb: AABB;

        constructor(shape: Shape);
    }

    export class Shape {
        type: number;

        Shape: boolean;

        id: number;

        prev: Shape;

        next: Shape;

        proxy: Proxy;

        parent: RigidBody;

        contactLink: ContactLink;

        numContacts: number;

        position: Vec3;

        rotation: Mat33;

        relativePosition: Vec3;

        relativeRotation: Mat33;

        aabb: AABB;

        density: number;
        friction: number;
        restitution: number;
        belongsTo: number;
        collidesWith: number;

        constructor(config: ShapeConfig);

        calculateMassInfo(out: MassInfo);
        updateProxy();
    }

    export class Box extends Shape {
        width: number;
        height: number;
        depth: number;
        dimentions: Float32Array;
        elements: Float32Array;

        constructor(config: ShapeConfig,
            Width: number, Height: number, Depth: number);



    }

    export class Sphere extends Shape {
        radius: number;

        constructor(config: ShapeConfig, radius: number);

        volume(): number;
    }

    export class Cylinder extends Shape {
        radius: number;
        height: number;
        normalDirection: Vec3;
    }

    export class Plane extends Shape {
        normal: Vec3;
        volume(): number;

    }

    export class Particle extends Shape {
        volume(): number;

    }

    export class LimitMotor {
        LimitMotor: boolean;

        axis: Vec3;
        angle: number;
        lowerLimit: number;
        upperLimit: number;
        motorSpeed: number;
        maxMotorForce: number;
        frequency: number;
        dampingRatio: number;

        constructor(axis: Vec3, fixed?: boolean);

        setLimit(lowerLimit: number, upperLimit: number);
        setMotor(motorSpeed: number, maxMotorForce: number);
        setSpring(frequency: number, dampingRatio: number);
    }

    class Constraint {
        Constraint: boolean;

        parent: World;
        body1: RigidBody;
        body2: RigidBody;

        addedToIsland: boolean;

        preSolve(timeStep: number, invTimeStep: number);
        solve();
        postSolve();
    }

    export class JointLink extends Constraint {
        prev: JointLink;
        next: JointLink;

        joint: Joint;

        constructor(j: Joint);

    }

    class Joint extends Constraint {
        scale: number;
        name: string;
        id: number;

        type: number;

        prev: Joint;
        next: Joint;

        body1: RigidBody;
        body2: RigidBody;

        localAnchorPoint1: Vec3;
        localAnchorPoint2: Vec3;

        relativeAnchorPoint1: Vec3;
        relativeAnchorPoint2: Vec3;

        anchorPoint1: Vec3;
        anchorPoint2: Vec3;

        allowCollision: boolean;

        b1Link: JointLink;
        b2Link: JointLink;


        constructor(config: JointConfig);

        setId(n: number | string);

        setParent(world: World);
        updateAnchorPoints();

        attach(isX?: boolean);

        detach(isX?: boolean);

        awake();

        preSolve(timeStep: number, invTimeStep: number);
        solve();
        postSolve();
        remove();
        dispose();

        getPosition(): Vec3[];
    }

    export class WheelJoint extends Joint {

    }

    export class SliderJoint extends Joint {
        constructor(config: JointConfig,
            lowerTranslation: number,
            upperTranslation: number);

    }

    export class PrismaticJoint extends Joint {
        constructor(config: JointConfig,
            lowerTranslation: number,
            upperTranslation: number);
    }

    export class DistanceJoint extends Joint {
        constructor(config: JointConfig,
            minDistance: number,
            maxDistance: number);
    }

    export class BallAndSocketJoint extends Joint {

    }

    export class HingeJoint extends Joint {
        constructor(config: JointConfig,
            lowerAngleLimit: number,
            upperAngleLimit: number);
    }

    class Pair {
        shape1: Shape;
        shape2: Shape;

        constructor(s1?: Shape, s2?: Shape);
    }

    class BroadPhase {
        type: number;
        numPairChecks: number;
        numPairs: number;
        pairs: Pair[];

    }

    class ContactLink {
        prev: ContactLink;
        next: ContactLink;
        shape: Shape;
        body: RigidBody;
        contact: Contact;

        constructor(contact: Contact);

    }

    class ManifoldPoint {
        warmStarted: boolean;
        position: Vec3;
        localPoint1: Vec3;
        localPoint2: Vec3;
        normal: Vec3;
        tangent: Vec3;
        binormal: Vec3;
        normalImpulse: number;
        tangentImpulse: number;
        binormalImpulse: number;
        normalDenominator: number;
        tangentDenominator: number;
        binormalDenominator: number;
        penetration: number;

    }
    class ContactManifold {
        body1: RigidBody;
        body2: RigidBody;
        numPoints: number;
        points: ManifoldPoint[];
    }

    class Contact {
        //  TODO: 待补充
    }


    export class RigidBody {
        position: Vec3;
        orientation: Quat;

        scale: number;

        id: number;

        name: string;
        prev: RigidBody;
        next: RigidBody;
        massInfo: MassInfo;

        controlPos: boolean;
        controlRot: boolean;
        quaternion: Quat;
        pos: Vec3;
        linearVelocity: Vec3;
        angularVelocity: Vec3;

        parent: World;
        contactLink: ContactLink;

        numContacts: number;

        shapes: Shape;
        numShapes: number;

        jointLink: JointLink;
        numJoints: number;

        sleepPosition: Vec3;
        sleepOrientation: Quat;

        isStatic: boolean;
        isDynamic: boolean;
        isKinematic: boolean;

        rotation: Mat33;

        mass: number;
        inverseMass: number;
        inverseInertia: Mat33;
        localInertia: Mat33;
        inverseLocalInertia: Mat33;
        tmpInertia: Mat33;

        addedToIsland: boolean;
        allowSleep: boolean;
        sleepTime: number;
        sleeping: boolean;


        constructor(Position?: Vec3, Rotation?: Quat);

        setParent(world: World);
        addShape(shape: Shape);

        removeShape(shape: Shape);
        remove();
        dispose();
        checkContact(name: string);

        setupMass(type: number, AdjustPosition: boolean);
        awake();

        sleep();

        testWakeUp();

        isLonely();

        updatePosition(timeStep: number);

        getAxis(): Vec3;
        rotateInertia(rotation: Quat, inertia: Mat33, out: Mat33);

        syncShapes();

        applyImpulse(position: Vec3, force: Vec3);

        setPosition(pos: Vec3);
        setQuaternion(q: Quat);
        setRotation(rot: Vec3);

        resetPosition(x: number, y: number, z: number);
        resetQuaternion(q: Quat);
        resetRotation(x: number, y: number, z: number);

        getPosition(): Vec3;
        getQuaternion(): Quat;
        connectMesh(mesh: any);

    }

    class CollisionDetector {
        flip: boolean;

        detectCollision(shape1: Shape, shape2: Shape, manifold: ContactManifold);
    }

    interface IWorldConfig {
        timestep: number;
        iterations: number;
        broadphase: number;
        worldscale: number;
        random: boolean;
        info: boolean;
        gravity: number[];
    }

    interface IWorldAddObject {
        type: string;   //TODO: 做枚举限制
    }

    export class World {
        World: boolean;

        scale: number;
        invScale: number;
        timeStep: number;
        timerate: number;

        timer: number;
        preLoop: () => void;
        postLoop: () => void;

        numIterations: number;

        broadphase: BroadPhase;

        Btypes: string[];
        broadPhaseType: string;
        performance: InfoDisplay;
        isStat: boolean;
        enableRandomizer: boolean;

        rigidBodies: RigidBody[];
        numRigidBodies: number;

        contacts: Contact[];
        unusedContacts: Contact[];
        numContacts: number;
        numContactPoints: number;
        joints: Joint[];
        numJoints: number;
        numIslands: number;
        gravity: Vec3;

        detectors: CollisionDetector[];
        islandRigidBodies: RigidBody[];
        islandStack: any[];
        islandConstraints: Constraint[];

        constructor(config: IWorldConfig);

        play();

        stop();

        setGravity(arr: number[]);
        getInfo(): string;
        clear();
        addRigidBody(body: RigidBody);
        removeRigidBody(body: RigidBody);

        getByName(name: string): any;

        addShape(shape: Shape);
        removeShape(shape: Shape);
        addJoint(joint: Joint);
        removeJoint(joint: Joint);

        addContact(s1: Shape, s2: Shape);
        removeContact(contact: Contact);

        getContact(b1: RigidBody | string, b2: RigidBody | string);
        checkContact(name1: string, name2: string);

        callSleep(body: RigidBody): boolean;

        step();

        add(o: IWorldAddObject);
    }

}