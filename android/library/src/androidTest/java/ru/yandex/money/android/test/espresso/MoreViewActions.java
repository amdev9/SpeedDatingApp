/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 NBCO Yandex.Money LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

package ru.yandex.money.android.test.espresso;

import android.support.test.espresso.PerformException;
import android.support.test.espresso.UiController;
import android.support.test.espresso.ViewAction;
import android.support.test.espresso.matcher.ViewMatchers;
import android.support.test.espresso.util.HumanReadables;
import android.support.test.espresso.util.TreeIterables;
import android.view.View;

import org.hamcrest.Matcher;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * @author Slava Yasevich (vyasevich@yamoney.ru)
 */
public final class MoreViewActions {

    private MoreViewActions() {
    }

    public static WaitAction waitView(int seconds, Matcher<View> matcher) {
        return new WaitView(duration(seconds), matcher);
    }

    public static WaitAction waitVisibilityChange(int seconds, int visibility) {
        return new WaitVisibilityChange(duration(seconds), visibility);
    }

    private static long duration(int seconds) {
        return TimeUnit.SECONDS.toMillis(seconds);
    }

    private static final class WaitView extends WaitAction {

        private final Matcher<View> matcher;

        public WaitView(long duration, Matcher<View> matcher) {
            super(duration);
            if (matcher == null) {
                throw new NullPointerException("matcher is null");
            }
            this.matcher = matcher;
        }

        @Override
        public Matcher<View> getConstraints() {
            return ViewMatchers.isRoot();
        }

        @Override
        public String getDescription() {
            return "waiting for a view" + super.getDescription();
        }

        @Override
        protected boolean isConditionMet(View view) {
            for (View child : TreeIterables.breadthFirstViewTraversal(view)) {
                if (matcher.matches(child)) {
                    return true;
                }
            }
            return false;
        }
    }

    private static final class WaitVisibilityChange extends WaitAction {

        private final int visibility;

        public WaitVisibilityChange(long duration, int visibility) {
            super(duration);
            if (visibility != View.GONE && visibility != View.INVISIBLE &&
                    visibility != View.VISIBLE) {
                throw new IllegalArgumentException("wrong visibility: " + visibility);
            }
            this.visibility = visibility;
        }

        @Override
        public Matcher<View> getConstraints() {
            return MoreViewMatchers.simpleViewMatcher();
        }

        @Override
        public String getDescription() {
            String text;
            switch (visibility) {
                case View.GONE:
                    text = "gone";
                    break;
                case View.INVISIBLE:
                    text = "invisible";
                    break;
                default:
                    text = "visible";
            }
            return "waiting for view to become " + text + super.getDescription();
        }

        @Override
        protected boolean isConditionMet(View view) {
            return view.getVisibility() == visibility;
        }
    }

    private static abstract class WaitAction implements ViewAction {

        private final long duration;

        public WaitAction(long duration) {
            if (duration < 0) {
                throw new IllegalArgumentException("duration is negative: " + duration);
            }
            this.duration = duration;
        }

        @Override
        public String getDescription() {
            return " for " + duration + " ms";
        }

        @Override
        public final void perform(UiController uiController, View view) {
            uiController.loopMainThreadUntilIdle();

            long finishTime = System.currentTimeMillis() + duration;
            while (System.currentTimeMillis() < finishTime) {
                if (isConditionMet(view)) {
                    return;
                }
                uiController.loopMainThreadForAtLeast(50L);
            }

            throw new PerformException.Builder()
                    .withActionDescription(this.getDescription())
                    .withViewDescription(HumanReadables.describe(view))
                    .withCause(new TimeoutException())
                    .build();
        }

        protected abstract boolean isConditionMet(View view);
    }
}
