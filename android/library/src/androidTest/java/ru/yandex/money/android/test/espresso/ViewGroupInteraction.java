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

import android.support.test.espresso.Espresso;
import android.support.test.espresso.ViewAction;
import android.support.test.espresso.ViewInteraction;
import android.view.View;
import android.view.ViewGroup;
import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.Matchers;
import org.hamcrest.TypeSafeMatcher;

import static android.support.test.espresso.matcher.ViewMatchers.withParent;

/**
 * @author Anton Ermak (ermak@yamoney.ru)
 */
public final class ViewGroupInteraction {

    private final Matcher<View> groupMatcher;

    private ViewGroupInteraction(final Matcher<View> groupMatcher) {
        this.groupMatcher = groupMatcher;
    }

    public static ViewGroupInteraction onViewGroup(final Matcher<View> rootMatcher) {
        return new ViewGroupInteraction(rootMatcher);
    }

    public ViewGroupInteraction atPosition(final int position) {
        return new ViewGroupInteraction(new TypeSafeMatcher<View>() {
            @Override
            public boolean matchesSafely(View view) {
                if (view.getParent() instanceof ViewGroup) {
                    final ViewGroup parent = (ViewGroup) view.getParent();
                    return groupMatcher.matches(parent) && parent.indexOfChild(view) == position;
                }
                return false;
            }

            @Override
            public void describeTo(Description description) {
                description.appendText("has parent ViewGroup matching: ");
                groupMatcher.describeTo(description);
                description.appendText("has view at position " + position);
            }
        });
    }

    public ViewGroupInteraction onChildView(Matcher<View> matcher) {
        //noinspection unchecked
        return new ViewGroupInteraction(Matchers.allOf(withParent(groupMatcher), matcher));
    }

    public ViewInteraction perform(ViewAction... actions) {
        return Espresso.onView(groupMatcher).perform(actions);
    }
}

