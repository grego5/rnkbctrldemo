import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput as NativeTextInput,
} from "react-native";
import {
  GestureHandlerRootView,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import {
  initialForm,
  multiLineFields,
  orderedFields,
  singleLineFields,
  type FieldKey,
  type FormState,
} from "./appData";

const ACTION_BAR_HEIGHT = 60;
const ACTION_BAR_MARGIN = 10;

function DemoScreen() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<FormState>(initialForm);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRegistry = useRef<NativeTextInput[]>([]);

  const updateField = (key: FieldKey, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const registerInput = (ref: NativeTextInput | null) => {
    if (!ref) return;
    inputRegistry.current.push(ref);
  };

  const focusFieldAt = (index: number) => {
    inputRegistry.current[index]?.focus();
  };

  const moveFocus = (direction: -1 | 1) => {
    const length = orderedFields.length;
    const baseIndex = focusedIndex ?? (direction > 0 ? -1 : 0);
    const nextIndex = (baseIndex + direction + length) % length;
    focusFieldAt(nextIndex);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Keyboard Controller Demo</Text>
        <Text style={styles.subtitle}>
          Plain React Native layout for testing KeyboardAwareScrollView and
          KeyboardStickyView.
        </Text>
      </View>

      <KeyboardAwareScrollView
        // @ts-ignore probably rngh 3 beta types bug
        ScrollViewComponent={ScrollView}
        bottomOffset={ACTION_BAR_HEIGHT + ACTION_BAR_MARGIN * 2}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {singleLineFields.map((field) => (
          <Field
            key={field.key}
            label={field.label}
            value={form[field.key]}
            inputIndex={orderedFields.indexOf(field.key)}
            setRef={registerInput}
            onFocus={setFocusedIndex}
            onSubmitEditing={() => moveFocus(1)}
            onChangeText={(value) => updateField(field.key, value)}
          />
        ))}

        {multiLineFields.map((field) => (
          <Field
            key={field.key}
            label={field.label}
            value={form[field.key]}
            minHeight={field.minHeight}
            multiline
            inputIndex={orderedFields.indexOf(field.key)}
            setRef={registerInput}
            onFocus={setFocusedIndex}
            onChangeText={(value) => updateField(field.key, value)}
          />
        ))}
      </KeyboardAwareScrollView>

      <KeyboardStickyView
        style={styles.toolbar}
        offset={{ closed: -insets.bottom }}>
        <ToolbarButton label="Prev" onPress={() => moveFocus(-1)} />
        <ToolbarButton label="Next" onPress={() => moveFocus(1)} />
        <ToolbarButton label="Save" />
        <ToolbarButton label="Quick" />
      </KeyboardStickyView>
    </SafeAreaView>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  inputIndex: number;
  setRef: (ref: NativeTextInput | null) => void;
  onFocus: (index: number) => void;
  onSubmitEditing?: () => void;
  multiline?: boolean;
  minHeight?: number;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{props.label}</Text>
      <TextInput
        ref={(ref) => props.setRef(ref)}
        value={props.value}
        onChangeText={props.onChangeText}
        onFocus={() => props.onFocus(props.inputIndex)}
        onSubmitEditing={props.onSubmitEditing}
        multiline={props.multiline}
        returnKeyType={props.multiline ? "default" : "next"}
        submitBehavior={props.multiline ? undefined : "submit"}
        style={[
          styles.input,
          props.minHeight != null && { minHeight: props.minHeight },
        ]}
        placeholder={props.label}
        placeholderTextColor="#7a7a7a"
        textAlignVertical={props.multiline ? "top" : "center"}
      />
    </View>
  );
}

function ToolbarButton(props: { label: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.toolbarButton} onPress={props.onPress}>
      <Text style={styles.toolbarButtonText}>{props.label}</Text>
    </Pressable>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.screen}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <DemoScreen />
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f1ea",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 6,
    backgroundColor: "#f4f1ea",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f1f1f",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555555",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: ACTION_BAR_HEIGHT + ACTION_BAR_MARGIN * 2,
    paddingTop: 8,
    gap: 14,
  },
  fieldBlock: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#353535",
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cfc7b9",
    backgroundColor: "#fffdf9",
    color: "#1f1f1f",
    fontSize: 16,
  },
  toolbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: ACTION_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 10,
    margin: ACTION_BAR_MARGIN,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d8d1c5",
    backgroundColor: "#fffdf9",
  },
  toolbarButton: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#e6dbc8",
  },
  toolbarButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2f2415",
  },
});

